import { ValidationPipe } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GameEntity } from 'src/_entities/game.entity';
import { GamesService } from './games.service';
import { createGameDto } from './_dto/create-game.dto';

@ApiTags('games')
@UsePipes(new ValidationPipe())
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOkResponse({ type: [GameEntity] })
  @Get()
  findAll(): Promise<GameEntity[]> {
    return this.gamesService.findAll();
  }

  @ApiCreatedResponse({ type: GameEntity })
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
