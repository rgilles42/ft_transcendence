import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class updateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  username?: string;

  @ApiProperty({ required: false })
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsInt()
  status?: number;

  @ApiProperty({ required: false })
  @IsString()
  activity?: string;
}
