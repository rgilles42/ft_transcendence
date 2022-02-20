import { ApiProperty } from '@nestjs/swagger';
import { gameType } from 'src/_entities/game.entity';

export class createGameDto {
  @ApiProperty()
  type: number;

  @ApiProperty()
  player1_id: number;

  @ApiProperty()
  player2_id: number;

  @ApiProperty({ required: false })
  player1_score?: number;

  @ApiProperty({ required: false })
  player2_score?: number;
}
