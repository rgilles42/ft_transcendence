import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
