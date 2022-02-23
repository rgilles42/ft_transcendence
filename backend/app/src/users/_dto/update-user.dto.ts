import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class updateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  username?: string;

  @ApiProperty({ required: false })
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  status?: string;
}
