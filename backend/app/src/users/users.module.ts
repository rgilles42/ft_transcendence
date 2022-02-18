import { Module } from '@nestjs/common';
import { configService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from 'src/_entities/user.entity';
import { FriendshipEntity } from 'src/_entities/friendship.entity';
import { BlockshipEntity } from 'src/_entities/blockship.entity';
import { FriendsModule } from './friends/friends.module';
import { BlockedModule } from './blocked/blocked.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([UserEntity, FriendshipEntity, BlockshipEntity]),
    FriendsModule,
    BlockedModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
