import { ValidationPipe } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GameEntity } from 'src/_entities/game.entity';
import { GamesService } from './games.service';
@ApiTags('games')
@UsePipes(new ValidationPipe())
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOkResponse({ type: [GameEntity] })
  @Get()
  findAll(): Promise<GameEntity[]> {
    return this.gamesService.findAll();
  }

  // @ApiCreatedResponse({ type: GameEntity })
  // @Post()
  // create(@Body() createGameData: createGameDto): Promise<GameEntity> {
  //   return this.gamesService.create(createGameData);
  // }

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
