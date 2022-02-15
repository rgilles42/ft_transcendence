import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel } from 'src/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([UserModel]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
