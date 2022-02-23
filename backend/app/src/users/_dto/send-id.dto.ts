import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class sendIdDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  targetUserId: number;
}
