import { ApiProperty } from '@nestjs/swagger';

export class messageDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  content: string;
}
