import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class updateMemberDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean = false;
}
