import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { MessageEntity } from 'src/_entities/channel-message.entity';
import { ChannelsModule } from '../channels.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => ChannelsModule),
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
