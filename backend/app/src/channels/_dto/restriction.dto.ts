import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class restrictionDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  user_to_restrict_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  type: number;

  @ApiProperty({ type: Date })
  @IsDate()
  end_date?: Date;
}
