import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
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
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiOkResponse({ type: MemberEntity, isArray: true })
  @Get()
  findAll(): Promise<MemberEntity[]> {
    return this.membersService.findAll();
  }

  @ApiOkResponse({ type: MemberEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<MemberEntity> {
    return this.membersService.remove(+id);
  }
}
