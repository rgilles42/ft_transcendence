import { ApiProperty } from '@nestjs/swagger';

export class updateUserDto {
  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  status?: string;
}
