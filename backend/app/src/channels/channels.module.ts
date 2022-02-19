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

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([
      ChannelEntity,
      UserEntity,
      RestrictionEntity,
      MessageEntity,
    ]),
    RestrictionsModule,
    MessagesModule,
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
