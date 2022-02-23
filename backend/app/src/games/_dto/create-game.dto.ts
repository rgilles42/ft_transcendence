import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { gameType } from 'src/_entities/game.entity';

export class createGameDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  type: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  player1_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  player2_id: number;

  @ApiProperty({ required: false })
  @IsInt()
  player1_score?: number;

  @ApiProperty({ required: false })
  @IsInt()
  player2_score?: number;
}
