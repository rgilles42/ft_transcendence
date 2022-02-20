import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [UsersModule, ChannelsModule, GamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
