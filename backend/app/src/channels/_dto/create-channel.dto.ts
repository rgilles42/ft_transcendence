import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class createChannelDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @ApiProperty({ required: false })
  @IsString()
  password?: string;
}
