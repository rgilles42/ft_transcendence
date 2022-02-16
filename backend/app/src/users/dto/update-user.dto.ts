import { ApiProperty } from '@nestjs/swagger';

export class updateUserDto {
  @ApiProperty()
  username?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  imageUrl?: string;

  @ApiProperty()
  status?: string;
}
