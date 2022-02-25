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

@WebSocketGateway(3001, { namespace: 'activity', cors: { origin: '*' } })
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

  async sendClientDiffToAll(changingClient: Socket, disconnect = false) {
    const userObject = changingClient.data.user;
    userObject.isDisconnecting = disconnect;
    const friends = (
      await this.usersService.findOne(userObject.id.toString(), 'friends')
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
      await this.usersService.findOne(client.data.user.id.toString(), 'friends')
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
