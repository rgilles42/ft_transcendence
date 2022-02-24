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
  player1Id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  player2Id: number;

  @ApiProperty({ required: false })
  @IsInt()
  player1Score?: number;

  @ApiProperty({ required: false })
  @IsInt()
  player2Score?: number;
}
