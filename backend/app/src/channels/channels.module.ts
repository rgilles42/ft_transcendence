import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { ChannelEntity } from 'src/entities/channel.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([ChannelEntity]),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
