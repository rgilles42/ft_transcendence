import { ApiProperty } from '@nestjs/swagger';

export class createChannelDto {
  @ApiProperty()
  owner: number;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty()
  type: boolean;

}