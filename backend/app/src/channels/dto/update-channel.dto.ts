import { ApiProperty } from '@nestjs/swagger';

export class updateChannelDto {
  @ApiProperty({ required: false })
  owner?: number;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ required: false })
  type?: boolean;
}