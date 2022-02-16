import { ApiProperty } from '@nestjs/swagger';

export class updateUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
