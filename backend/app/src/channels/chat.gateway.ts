import {
  ForbiddenException,
  forwardRef,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { configService } from 'src/config/config.service';
import { UsersService } from 'src/users/users.service';
import { parse } from 'cookie';
import { ChannelsService } from './channels.service';
import { MessageEntity } from 'src/_entities/channel-message.entity';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';

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
    @Inject(forwardRef(() => ChannelsService))
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
      client.emit('Error', new ForbiddenException(error));
      return client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('channelId') channelId: number,
    @MessageBody('content') messageContent: string,
  ) {
    console.log(`sendMessage: ${client.id} ${channelId} <${messageContent}>`);
    const message = new MessageEntity();
    message.channelId = channelId;
    message.content = messageContent;
    message.userId = client.data.user.id;
    try {
      await this.channelsService.send_message(channelId, message.userId, {
        content: messageContent,
      });
    } catch (err) {
      throw err;
    }
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody('channelId') channelId: number,
  ) {
    console.log(`onJoinChannel: ${client.id}`);
    let channel;
    try {
      channel = await this.channelsService.findOne(client.data.user.id, channelId, [
        'members', 'restrictions',
        ]);
    } catch {
      throw new NotFoundException();
    }
    if (!this.channelsService.isMember(client.data.user.id, channel) || this.channelsService.isBanned(client.data.user.id, channel)) {
      throw new ForbiddenException();
    }
    client.join(channelId.toString());
  }
  @SubscribeMessage('leaveChannel')
  async onLeaveChannel(client: Socket, channelId: number) {
    client.leave(channelId.toString());
  }

  broadcastNewMessage(newMessage: MessageEntity) {
    this.server
      .in(newMessage.channelId.toString())
      .emit('newMessage', newMessage);
  }

  broadcastNewMember(newMember: MemberEntity) {
    this.server.in(newMember.channelId.toString()).emit('newMember', newMember);
  }
  async broadcastDeleteMember(deletedMember: MemberEntity) {
    const sockets = await this.server
      .in(deletedMember.channelId.toString())
      .fetchSockets();
    const deletedClient = sockets.find(
      (sock) => sock.data.user.id === deletedMember.userId,
    );
    if (deletedClient) {
      deletedClient.disconnect();
    }
    this.server
      .in(deletedMember.channelId.toString())
      .emit('deletedMember', deletedMember.id);
  }

  async broadcastNewRestriction(newRestriction: RestrictionEntity) {
    if (newRestriction.type === 1) {
      const sockets = await this.server
        .in(newRestriction.channelId.toString())
        .fetchSockets();
      const deletedClient = sockets.find(
        (sock) => sock.data.user.id === newRestriction.userId,
      );
      if (deletedClient) {
        deletedClient.disconnect();
      }
    }
    this.server
      .in(newRestriction.channelId.toString())
      .emit('newRestriction', newRestriction);
  }
  broadcastDeleteRestriction(deletedRestriction: RestrictionEntity) {
    this.server
      .in(deletedRestriction.channelId.toString())
      .emit('deletedRestriction', deletedRestriction.id);
  }
}
