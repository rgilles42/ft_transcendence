import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { FriendshipEntity } from 'src/_entities/users_friendship.entity';

@Module({
  providers: [FriendsService],
  controllers: [FriendsController],
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([FriendshipEntity]),
  ],
})
export class FriendsModule {}
