import { ApiProperty } from '@nestjs/swagger';

export class memberDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  asAdmin?: boolean;
}
