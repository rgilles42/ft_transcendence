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

@WebSocketGateway({ namespace: 'activity', cors: { origin: '*' } })
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
  The UserActivity object is as such: {id: number, inGame: boolean, isDisconnecting: boolean}
  This socket covers the following events:

  On every new user connection, two things will happen :
    - an array of UserActivity objects describing his/her online friends will be sent to him in a connectedUsers message:
          expect this: [{onlineFriendId1, false, false}, {onlineFriendId2, true, false}, {onlineFriendId3, false, false}...]
    - an array of a single UserActivity object describing him will be sent to his currently online friends in a connectedUsers message:
          expect this: [{newUserId, false, false}]

  Everytime a user joins or quits a game, he or she should send a changeGameActivity message of any payload, then :
    - an array of a single UserActivity object describing him will be sent to his currently online friends in a connectedUsers message:
          expect this: [{userid, oppositeOfPreviousInGameStatus, false}]

  On every user disconnect :
    - an array of a single UserActivity object describing him will be sent to his currently online friends in a connectedUsers message:
          expect this: [{disconnectingUserId, false, true}]

    [{ id: 5, newStatus: 2 }]: id 5 vient d'entrer en game
    [{ id: 5, newStatus: 1 }]: id 5 vient de ce connecter
    [{ id: 5, newStatus: 0 }]: id 5 vient de ce déconnecter

  */

  async sendClientDiffToAll(changingClient: Socket, disconnect = false) {
    const userObject = changingClient.data.user;
    userObject.isDisconnecting = disconnect;
    const friends = (
      await this.usersService.findOne(userObject.id.toString(), ['friends'])
    ).friends;
    this.userSockets.forEach((socket) => {
      if (
        socket.data.user.id !== userObject.id &&
        friends.some(
          (friendship) =>
            socket.data.user.id === friendship.friendId ||
            socket.data.user.id === friendship.userId,
        )
      )
        socket.emit('connectedUsers', [userObject]);
    });
  }

  @SubscribeMessage('changeGameActivity')
  async changeGameActivity(changingClient: Socket) {
    changingClient.data.user.inGame = !changingClient.data.user.inGame;
    const userToEdit = this.userSockets.find(
      (socket) => socket.id === changingClient.id,
    ).data.user;
    userToEdit.inGame = !userToEdit.inGame;
    this.sendClientDiffToAll(changingClient);
  }

  async sendAllLoggedFriendsToOne(client: Socket): Promise<void> {
    const friends = (
      await this.usersService.findOne(client.data.user.id.toString(), [
        'friends',
      ])
    ).friends;
    console.log(friends);
    const loggedFriends = [];
    this.userSockets.forEach((socket) => {
      if (
        socket.data.user.id !== client.data.user.id &&
        friends.some(
          (friendship) =>
            socket.data.user.id === friendship.friendId ||
            socket.data.user.id === friendship.userId,
        )
      )
        loggedFriends.push(socket.data.user);
    });
    client.emit('connectedUsers', loggedFriends);
  }

  async handleConnection(client: Socket) {
    try {
      console.log(`Client Connected: ${client.id}`);
      console.log(client);
      const access_token = client.handshake.auth.access_token;
      if (!access_token)
        throw new UnauthorizedException(
          'No access_token in auth field of socket.',
        );
      const payload = this.authService.verifyJwt(access_token);
      const user = await this.usersService.findOne(payload.id);
      if (!user) throw new UnauthorizedException('User not found');
      client.data.user = { id: user.id, inGame: false, isDisconnecting: false };
      this.userSockets.push(client);
      await this.sendAllLoggedFriendsToOne(client);
      await this.sendClientDiffToAll(client);
    } catch (error) {
      client.emit('Error', new UnauthorizedException());
      return client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
    const socketIndex = this.userSockets.findIndex(
      (socket) => socket.id === client.id,
    );
    if (socketIndex > -1) {
      this.userSockets.splice(socketIndex, 1);
    }
    await this.sendClientDiffToAll(client, true);
  }
}
