import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createChannelDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;
}
