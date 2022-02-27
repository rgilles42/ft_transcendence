import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelEntity } from 'src/_entities/channel.entity';
import { createChannelDto } from './_dto/create-channel.dto';
import { updateChannelDto } from './_dto/update-channel.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MessageEntity } from 'src/_entities/channel-message.entity';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';
import { messageDto } from './_dto/message.dto';
import { restrictionDto } from './_dto/restriction.dto';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { memberDto } from './_dto/member.dto';
import { ValidationPipe } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('channels')
@UsePipes(new ValidationPipe())
@Controller('channels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  @Get()
  findAll(@Query('include') include = ''): Promise<ChannelEntity[]> {
    return this.channelsService.findAll(include.split('+'));
  }

  @ApiCreatedResponse({ type: ChannelEntity })
  @Post()
  create(
    @Request() req: any,
    @Body() createChannelData: createChannelDto,
  ): Promise<ChannelEntity> {
    return this.channelsService.create(req.user, createChannelData);
  }

  @ApiQuery({
    name: 'include',
    description:
      "The relations to include to the channel object to return (owner, members, restrictions and/or messages (ex: 'members+restrictions')",
    required: false,
    type: String,
  })
  @ApiOkResponse({ type: ChannelEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  findOne(
    @Request() req,
    @Param('id') id: string,
    @Query('include') include = '',
  ): Promise<ChannelEntity> {
    return this.channelsService.findOne(req.user.id, +id, include.split('+'));
  }

  @ApiOkResponse({ type: ChannelEntity })
  @ApiNotFoundResponse()
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateChannelDto: updateChannelDto,
  ): Promise<ChannelEntity> {
    return this.channelsService.update(+id, req.user.id, updateChannelDto);
  }

  @ApiOkResponse({ type: ChannelEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string): Promise<ChannelEntity> {
    return this.channelsService.remove(+id, req.user.id);
  }

  @ApiOkResponse({ type: [MessageEntity] })
  @ApiNotFoundResponse()
  @Get(':id/messages')
  get_messages(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<MessageEntity[]> {
    return this.channelsService.get_messages(+id, req.user.id);
  }

  @ApiCreatedResponse({ type: MessageEntity })
  @Post(':id/messages')
  send_message(
    @Request() req: any,
    @Param('id') id: string,
    @Body() messageData: messageDto,
  ): Promise<MessageEntity> {
    return this.channelsService.send_message(+id, req.user.id, messageData);
  }

  @ApiOkResponse({ type: [RestrictionEntity] })
  @ApiNotFoundResponse()
  @Get(':id/restrictions')
  get_restrictions(@Param('id') id: string): Promise<RestrictionEntity[]> {
    return this.channelsService.get_restrictions(+id);
  }

  @ApiCreatedResponse({ type: RestrictionEntity })
  @Post(':id/restrictions')
  create_restriction(
    @Request() req: any,
    @Param('id') id: string,
    @Body() restrData: restrictionDto,
  ): Promise<RestrictionEntity> {
    return this.channelsService.create_restriction(+id, req.user.id, restrData);
  }

  @ApiOkResponse({ type: [MemberEntity] })
  @ApiNotFoundResponse()
  @Get(':id/members')
  get_members(@Param('id') id: string): Promise<MemberEntity[]> {
    return this.channelsService.get_members(+id);
  }

  @ApiCreatedResponse({ type: MemberEntity })
  @Post(':id/members')
  add_member(
    @Request() req: any,
    @Param('id') id: string,
    @Body() memberData: memberDto,
  ): Promise<MemberEntity> {
    return this.channelsService.add_member(+id, req.user.id, memberData);
  }
}
