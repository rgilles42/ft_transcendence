import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { FriendshipEntity } from 'src/_entities/users_friendship.entity';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService],
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([FriendshipEntity]),
  ],
})
export class FriendsModule {}
