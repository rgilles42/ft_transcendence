import { ApiProperty } from '@nestjs/swagger';
import { restrictionType } from 'src/_entities/channel-restriction.entity';

export class restrictionDto {
  @ApiProperty()
  channel_id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty({ type: restrictionType })
  type: restrictionType;

  @ApiProperty({ type: Date })
  end_date?: Date;
}
