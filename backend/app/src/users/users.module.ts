import { Module } from '@nestjs/common';
import { configService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from 'src/_entities/user.entity';
import { FriendshipEntity } from 'src/_entities/users_friendship.entity';
import { BlockshipEntity } from 'src/_entities/users_blockship.entity';
import { FriendsModule } from './friends/friends.module';
import { BlockedModule } from './blocked/blocked.module';
import { GamesModule } from 'src/games/games.module';
import { GameEntity } from 'src/_entities/game.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([
      UserEntity,
      FriendshipEntity,
      BlockshipEntity,
      GameEntity,
    ]),
    FriendsModule,
    BlockedModule,
    GamesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
