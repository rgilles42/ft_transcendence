import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsInt} from 'class-validator';

export class createChannelDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  type: boolean;

  @ApiProperty({ required: false })
  @IsString()
  password?: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  owner_id: number;
}
