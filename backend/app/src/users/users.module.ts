import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from 'src/entities/user.entity';
import { FriendshipEntity } from 'src/entities/friendship.entity';
import { BlockshipEntity } from 'src/entities/blockship.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([UserEntity, FriendshipEntity, BlockshipEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
