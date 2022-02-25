import { configService } from 'src/config/config.service';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
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
  namespace: 'activity',
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
export class ActivityGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  private logger: Logger = new Logger('ActivityGateway');
  private userSockets: Socket[] = [];

  /*
  The UserActivity object is as such: {id: number, newStatus: number}, with newStatus being either: 1 (connected), 2 (in game), or 0 (disconnecting)
  This socket covers the following events:

  On every new user connection, two things will happen :
    - an array of UserActivity objects describing his/her online friends will be sent to him in a connectedUsers message:
          new arriving user expect this: [{currentlyOnlineFriendId1, 1}, {currentlyOnlineFriendId2, 2}, {currentlyOnlineFriendId3, 1}]
    - an array of a single UserActivity object describing him will be sent to his currently online friends in a connectedUsers message:
          connected friends expect this: [{arrivingUserId, 1}]

  On every changeGameActivity message of any payload from an user:
    - an array of a single UserActivity object describing him will be sent to his currently online friends in a connectedUsers message:
          connected friends expect this: [{statusChangingUserId, (1 or 2)}]

  On every user disconnect:
    - an array of a single UserActivity object describing him will be sent to his currently online friends in a connectedUsers message:
          connected friends expect this: [{disconnectingUserId, 0}]

  */

  async sendAllLoggedFriendsToArriving(client: Socket): Promise<void> {
    const clientFriends = (
      await this.usersService.findOne(client.data.user.id.toString(), [
        'friends',
      ])
    ).friends;
    const connectedFriendsUserActivities = [];
    this.userSockets.forEach((socket) => {
      if (
        socket.data.user.id !== client.data.user.id &&
        clientFriends.some(
          (clientFriendship) =>
            socket.data.user.id === clientFriendship.friendId ||
            socket.data.user.id === clientFriendship.userId,
        )
      )
        connectedFriendsUserActivities.push(socket.data.user);
    });
    client.emit('connectedUsers', connectedFriendsUserActivities);
  }

  async sendClientDiffToAll(changingClient: Socket) {
    const userNewActivity = changingClient.data.user;
    const clientFriends = (
      await this.usersService.findOne(userNewActivity.id.toString(), [
        'friends',
      ])
    ).friends;
    this.userSockets.forEach((socket) => {
      if (
        socket.data.user.id !== userNewActivity.id &&
        clientFriends.some(
          (clientFriendship) =>
            socket.data.user.id === clientFriendship.friendId ||
            socket.data.user.id === clientFriendship.userId,
        )
      )
        socket.emit('connectedUsers', [userNewActivity]);
    });
  }

  @SubscribeMessage('changeGameActivity')
  async changeGameActivity(changingClient: Socket) {
    const storedClientSocket = this.userSockets.find(
      (socket) => socket.id === changingClient.id,
    );
    storedClientSocket.data.user.newStatus =
      storedClientSocket.data.user.newStatus === 2 ? 1 : 2;
    this.sendClientDiffToAll(storedClientSocket);
  }

  async handleConnection(client: Socket) {
    try {
      console.log(`Client Connected: ${client.id}`);
      console.log(client);
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
      client.data.user = { id: user.id, newStatus: 1 };
      this.userSockets.push(client);
      await this.sendAllLoggedFriendsToArriving(client);
      await this.sendClientDiffToAll(client);
    } catch (error) {
      client.emit('Error', new UnauthorizedException(error));
      return client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
    const socketToDelete = this.userSockets.find(
      (socket) => socket.id === client.id,
    );
    const socketIndex = this.userSockets.findIndex(
      (socket) => socket.id === client.id,
    );
    if (socketIndex > -1) {
      this.userSockets.splice(socketIndex, 1);
    }
    socketToDelete.data.user.newStatus = 0;
    await this.sendClientDiffToAll(socketToDelete);
  }
}
