import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class memberDto {
  @ApiProperty()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  newMemberId: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  asAdmin?: boolean;
}
