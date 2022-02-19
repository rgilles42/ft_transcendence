import { ApiProperty } from '@nestjs/swagger';

export class updateChannelDto {
  @ApiProperty({ required: false })
  channel_password?: string;

  @ApiProperty({ required: false })
  new_channel_type?: boolean;

  @ApiProperty({ required: false })
  new_password?: string;

  @ApiProperty({ required: false })
  new_user_id?: number;

  @ApiProperty({ required: false })
  make_admin_as_well?: boolean;
}
