import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class restrictionDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  type: number;

  @ApiProperty({ type: Date })
  @IsDate()
  @IsOptional()
  endAt?: Date | null;
}
