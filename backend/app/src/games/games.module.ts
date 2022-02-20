import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { GameEntity } from 'src/_entities/game.entity';
import { UserEntity } from 'src/_entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([GameEntity, UserEntity]),
  ],
  providers: [GamesService],
  controllers: [GamesController],
})
export class GamesModule {}
