import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

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
  @IsOptional()
  endAt?: Date | null;
}
