import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class createGameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  map: string;

  @ApiProperty()
  @IsNotEmpty()
  powerUps: string[];

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
