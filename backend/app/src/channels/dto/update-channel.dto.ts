import { ApiProperty } from '@nestjs/swagger';

export class updateChannelDto {
  @ApiProperty({ required: false })
  type?: boolean;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ required: false })
  userid?: number;

  @ApiProperty({ required: false })
  isAdmin?: boolean;
}
