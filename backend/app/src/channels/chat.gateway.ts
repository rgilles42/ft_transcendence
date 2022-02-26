import { UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { configService } from 'src/config/config.service';
import { UsersService } from 'src/users/users.service';
import { parse } from 'cookie';
import { ChannelsService } from './channels.service';

@WebSocketGateway({
  namespace: 'chat',
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
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private channelsService: ChannelsService,
  ) {}

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
    } catch (error) {
      client.emit('Error', new UnauthorizedException(error));
      return client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(client: Socket, channelId: number) {
    const userChannels = await this.usersService.get_channels(client.data.user.id);
    if (userChannels.some((channel) => channel.id === channelId))
      client.join(channelId.toString());

  }
  @SubscribeMessage('leaveChannel')
  async onLeaveChannel(client: Socket, roomID: number) {

  }
}
