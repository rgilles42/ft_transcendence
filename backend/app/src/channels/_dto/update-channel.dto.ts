import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class updateChannelDto {
  @ApiProperty({ required: false })
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  isPrivate?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  newPassword?: string;
}
