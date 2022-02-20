import { ApiProperty } from '@nestjs/swagger';

export class messageDto {
  @ApiProperty()
  content: string;
}
