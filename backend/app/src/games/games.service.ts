import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/_entities/game.entity';
import { UserEntity } from 'src/_entities/user.entity';
import { Repository } from 'typeorm';
import { createGameDto } from './_dto/create-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameEntity)
    private gamesRepository: Repository<GameEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<GameEntity[]> {
    return this.gamesRepository.find({ relations: ['player1', 'player2'] });
  }

  async findOne(id: number): Promise<GameEntity> {
    try {
      return await this.gamesRepository.findOneOrFail(id, {
        relations: ['player1', 'player2'],
      });
    } catch (err) {
      throw new NotFoundException();
    }
  }
  async create(createGameData: createGameDto): Promise<GameEntity> {
    const newGame = new GameEntity();
    newGame.type = createGameData.type;
    newGame.player1 = await this.usersRepository.findOneOrFail(
      createGameData.player1_id,
    );
    newGame.player2 = await this.usersRepository.findOneOrFail(
      createGameData.player2_id,
    );
    if (createGameData.player1_score !== undefined)
      newGame.player1score = createGameData.player1_score;
    if (createGameData.player2_score !== undefined)
      newGame.player2score = createGameData.player2_score;
    console.log(newGame);
    await this.gamesRepository.save(newGame);
    return newGame;
  }

  async remove(id: number): Promise<GameEntity> {
    try {
      const user = await this.gamesRepository.findOneOrFail(id);
      this.gamesRepository.delete(id);
      return user;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
