import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class restrictionDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  targetUserId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  type: number;

  @ApiProperty({ type: Date })
  @IsDate()
  endDate?: Date;
}
