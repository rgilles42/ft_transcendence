import { configService } from 'src/config/config.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { parse } from 'cookie';

@WebSocketGateway({
  namespace: 'usersStatus',
  cors: {
    origin: (reqOrigin, cb) => {
      if (
        !reqOrigin ||
        !configService.getCorsConfig().origin.includes(reqOrigin)
      ) {
        cb(new Error('Not allowed by CORS'));
        return;
      }
      cb(null, true);
    },
    credentials: configService.getCorsConfig().credentials,
  },
})
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  private logger: Logger = new Logger('StatusGateway');
  private userSockets: Socket[] = [];

  /*
  The UserStatus object is as such: {id: number, newStatus: number}, with newStatus being either: 1 (connected), 2 (in game), or 0 (disconnecting)
  This socket covers the following events:

  On every new user connection, two things will happen :
    - an array of UserStatus objects describing his/her online friends will be sent to him in a usersStatusUpdate message:
          new arriving user expect this: [{currentlyOnlineFriendId1, 1}, {currentlyOnlineFriendId2, 2}, {currentlyOnlineFriendId3, 1}]
    - an array of a single UserStatus object describing him will be sent to his currently online friends in a usersStatusUpdate message:
          connected friends expect this: [{arrivingUserId, 1}]

  On every changeGameStatus message of any payload from an user:
    - an array of a single UserStatus object describing him will be sent to his currently online friends in a usersStatusUpdate message:
          connected friends expect this: [{statusChangingUserId, (1 or 2)}]

  On every user disconnect:
    - an array of a single UserStatus object describing him will be sent to his currently online friends in a usersStatusUpdate message:
          connected friends expect this: [{disconnectingUserId, 0}]

  */

  // Utils Methods

  async getFriendsSockets(client: Socket) {
    const user = await this.usersService.findOne(
      client.data.user.id.toString(),
      ['friends'],
    );
    if (!user || !user.friends) {
      return [];
    }
    return this.userSockets.filter((socket) => {
      if (socket.data.user.id === user.id) {
        return false;
      }
      return user.friends.some(
        (clientFriendship) =>
          socket.data.user.id === clientFriendship.friendId ||
          socket.data.user.id === clientFriendship.userId,
      );
    });
  }

  createStatusMessage(socket: Socket) {
    return { id: socket.data.user.id, newStatus: socket.data.user.status };
  }

  async sendFriendStatusToMe(client: Socket): Promise<void> {
    const socketFriends = await this.getFriendsSockets(client);
    const connectedstatus = socketFriends.map((socket) =>
      this.createStatusMessage(socket),
    );
    client.emit('usersStatusUpdate', connectedstatus);
  }

  async sendMyStatusToFriend(client: Socket): Promise<void> {
    const socketFriends = await this.getFriendsSockets(client);
    socketFriends.forEach((socket) => {
      socket.emit('usersStatusUpdate', [this.createStatusMessage(client)]);
    });
  }

  // Socket Methods

  @SubscribeMessage('changeGameStatus')
  async changeGameStatus(client: Socket) {
    console.log(`Client Change Status: ${client.id}`);
    const socketIndex = this.userSockets.findIndex(
      (socket) => socket.id === client.id,
    );
    if (socketIndex > -1) {
      client.data.user.status = client.data.user.status === 2 ? 1 : 2;
      await this.sendMyStatusToFriend(client);
    }
  }

  async handleConnection(client: Socket) {
    try {
      console.log(`Client Connected: ${client.id}`);
      const cookies = parse(client.handshake.headers.cookie || '');
      const access_token =
        client.handshake.auth.access_token || cookies.access_token;
      if (!access_token) {
        throw new UnauthorizedException('No access_token provided.');
      }
      const payload = this.authService.verifyJwt(access_token);
      const user = await this.usersService.findOne(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      user.status = 1;
      client.data.user = user;
      this.userSockets.push(client);
      await this.sendFriendStatusToMe(client);
      await this.sendMyStatusToFriend(client);
    } catch (error) {
      client.emit('Error', new UnauthorizedException(error));
      return client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
    const socketIndex = this.userSockets.findIndex(
      (socket) => socket.id === client.id,
    );
    if (socketIndex > -1) {
      client.data.user.status = 0;
      this.userSockets.splice(socketIndex, 1);
      await this.sendMyStatusToFriend(client);
    }
  }
}
