import { ApiProperty } from '@nestjs/swagger';

export class restrictionDto {
  @ApiProperty()
  user_to_restrict_id: number;

  @ApiProperty()
  type: number;

  @ApiProperty({ type: Date })
  end_date?: Date;
}
