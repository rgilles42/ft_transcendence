import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class messageDto {
  @ApiProperty()
  @IsString()
  content: string;
}
