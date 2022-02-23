import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class updateChannelDto {
  @ApiProperty({ required: false })
  @IsString()
  channel_password?: string;

  @ApiProperty({ required: false })
  @IsString()
  new_channel_type?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  new_password?: string;
}
