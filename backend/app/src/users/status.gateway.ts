import { configService } from 'src/config/config.service';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
export class StatusGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /*
  The UserStatus object is as such: {id: number, newStatus: number}, with newStatus being either: 1 (connected), 2 (in game), or 0 (disconnecting)
  This socket covers the following events:

  On every new user connection, two things will happen :
    - an array of UserStatus objects describing his/her online friends will be sent to him in a usersStatusUpdate message:
          new arriving user expect this: [{currentlyOnlineFriendId1, 1}, {currentlyOnlineFriendId2, 2}, {currentlyOnlineFriendId3, 1}]
    - an array of a single UserStatus object describing him will be sent to his currently online friends in a usersStatusUpdate message:
          connected friends expect this: [{arrivingUserId, 1}]

  On every changeStatus message of any payload from an user:
    - an array of a single UserStatus object describing him will be sent to his currently online friends in a usersStatusUpdate message:
          connected friends expect this: [{statusChangingUserId, (1 or 2)}]

  On every user disconnect:
    - an array of a single UserStatus object describing him will be sent to his currently online friends in a usersStatusUpdate message:
          connected friends expect this: [{disconnectingUserId, 0}]

  */

  // Utils Methods

  async getServerSockets() {
    return (await this.server.fetchSockets()) as unknown as Socket[];
  }

  async getFriendsSockets(client: Socket) {
    const user = await this.usersService.findOne(
      client.data.user.id.toString(),
      ['friends'],
    );
    if (!user || !user.friends) {
      return [];
    }
    const sockets = await this.getServerSockets();
    const friendsSocket = sockets.filter((socket) => {
      if (socket.data.user.id === user.id) {
        return false;
      }
      return user.friends.some(
        (clientFriendship) =>
          socket.data.user.id === clientFriendship.friendId ||
          socket.data.user.id === clientFriendship.userId,
      );
    });
    return friendsSocket;
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

  afterInit() {
    this.server.use(async (newClient, next) => {
      try {
        const cookies = parse(newClient.handshake.headers.cookie || '');
        const access_token =
          newClient.handshake.auth.access_token || cookies.access_token;
        if (!access_token) {
          throw new UnauthorizedException('No access_token provided.');
        }
        const payload = this.authService.verifyJwt(access_token);
        const user = await this.usersService.findOne(payload.id);
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        newClient.data.user = user;
        next();
      } catch (err) {
        next(err);
      }
    });
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      console.log(`Client Connected: ${client.id}`);
      client.data.user.status = 1;
      await this.sendFriendStatusToMe(client);
      await this.sendMyStatusToFriend(client);
    } catch (error) {
      client.emit('Error', new ForbiddenException(error));
      return client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
    client.data.user.status = 0;
    await this.sendMyStatusToFriend(client);
  }

  @SubscribeMessage('changeStatus')
  async changeStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody('newStatus') newStatus: number,
  ) {
    console.log(`Client Change Status: ${client.id}`);
    client.data.user.status = newStatus;
    await this.sendMyStatusToFriend(client);
  }

  @SubscribeMessage('sendGameInvitation')
  async sendGameInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody('userId') userId: number,
    @MessageBody('map') map: string,
  ) {
    console.log(`Client invit: ${client.id}`);
    const sockets = await this.getServerSockets();
    const invited = sockets.find((find) => find.data.user.id === userId);
    if (invited) {
      invited.emit('invitedInGame', client.data.user.id, map);
    }
  }
}
