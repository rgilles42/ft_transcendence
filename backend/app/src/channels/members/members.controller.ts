import { updateMemberDto } from './../_dto/update-member.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { MembersService } from './members.service';

@ApiTags('channel_members')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('channels/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiOkResponse({ type: MemberEntity, isArray: true })
  @Get()
  findAll(): Promise<MemberEntity[]> {
    return this.membersService.findAll();
  }

  @ApiOkResponse({ type: MemberEntity })
  @ApiNotFoundResponse()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMemberDto: updateMemberDto,
  ): Promise<MemberEntity> {
    return this.membersService.update(+id, updateMemberDto);
  }

  @ApiOkResponse({ type: MemberEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<MemberEntity> {
    return this.membersService.remove(+id);
  }
}
