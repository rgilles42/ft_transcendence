import { ApiProperty } from '@nestjs/swagger';

export class sendIdDto {
  @ApiProperty()
  target_user_id: number;
}
