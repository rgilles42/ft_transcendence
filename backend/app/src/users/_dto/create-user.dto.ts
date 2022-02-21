import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ required: false })
  imageUrl?: string;
}
