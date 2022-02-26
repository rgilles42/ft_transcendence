import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class memberDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  channelId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  isAdmin?: boolean;
}
