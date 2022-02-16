import { ApiProperty } from '@nestjs/swagger';

export class createChannelDto {
  @ApiProperty()
  type: boolean;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty()
  owner: number;
}
