import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class memberDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  asAdmin?: boolean;
}
