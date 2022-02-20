import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GameEntity } from 'src/_entities/game.entity';
import { GamesService } from './games.service';
import { createGameDto } from './_dto/create-game.dto';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOkResponse({ type: [GameEntity] })
  @Get()
  findAll(): Promise<GameEntity[]> {
    return this.gamesService.findAll();
  }

  @ApiOkResponse({ type: GameEntity })
  @Post()
  create(@Body() createGameData: createGameDto): Promise<GameEntity> {
    return this.gamesService.create(createGameData);
  }

  @ApiOkResponse({ type: GameEntity })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<GameEntity> {
    return this.gamesService.findOne(+id);
  }

  @ApiOkResponse({ type: GameEntity })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<GameEntity> {
    return this.gamesService.remove(+id);
  }
}
