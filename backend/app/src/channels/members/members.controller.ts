import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { MembersService } from './members.service';

@ApiTags('channel_members')
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
