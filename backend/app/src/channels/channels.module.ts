import { Module } from '@nestjs/common';
import { configService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { ChannelEntity } from 'src/_entities/channel.entity';
import { UserEntity } from 'src/_entities/user.entity';
import { RestrictionsModule } from './restrictions/restrictions.module';
import { MessagesModule } from './messages/messages.module';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';
import { MessageEntity } from 'src/_entities/channel-message.entity';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { MembersModule } from './members/members.module';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([
      ChannelEntity,
      UserEntity,
      RestrictionEntity,
      MessageEntity,
      MemberEntity,
    ]),
    RestrictionsModule,
    MessagesModule,
    MembersModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChatGateway],
})
export class ChannelsModule {}
