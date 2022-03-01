import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtTwoFaAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';
import { GameEntity } from 'src/_entities/game.entity';
import { GamesService } from './games.service';
import { createGameDto } from './_dto/create-game.dto';

@ApiTags('games')
@ApiBearerAuth('access_token')
@UseGuards(JwtTwoFaAuthGuard)
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
