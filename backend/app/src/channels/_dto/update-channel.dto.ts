import { ApiProperty } from '@nestjs/swagger';

export class updateChannelDto {
  @ApiProperty({ required: false })
  channel_password?: string;

  @ApiProperty({ required: false })
  new_channel_type?: boolean;

  @ApiProperty({ required: false })
  new_password?: string;
}
