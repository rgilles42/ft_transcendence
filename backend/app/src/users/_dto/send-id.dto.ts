import { ApiProperty } from '@nestjs/swagger';

export class sendIdDto {
  @ApiProperty()
  id: number;
}
