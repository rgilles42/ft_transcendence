import { ApiProperty } from '@nestjs/swagger';

export class messageDto {
  @ApiProperty()
  channel_id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  message: string;
}
