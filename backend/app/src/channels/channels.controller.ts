import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelEntity } from 'src/_entities/channel.entity';
import { createChannelDto } from './_dto/create-channel.dto';
import { updateChannelDto } from './_dto/update-channel.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MessageEntity } from 'src/_entities/channel-message.entity';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';
import { messageDto } from './_dto/message.dto';
import { restrictionDto } from './_dto/restriction.dto';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiOkResponse({ type: ChannelEntity, isArray: true })
  @Get()
  findAll(): Promise<ChannelEntity[]> {
    return this.channelsService.findAll();
  }

  @ApiCreatedResponse({ type: ChannelEntity })
  @Post()
  create(@Body() createChannelData: createChannelDto): Promise<ChannelEntity> {
    return this.channelsService.create(createChannelData);
  }

  @ApiOkResponse({ type: ChannelEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ChannelEntity> {
    return this.channelsService.findOne(+id);
  }

  @ApiOkResponse({ type: ChannelEntity })
  @ApiNotFoundResponse()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChannelDto: updateChannelDto,
  ): Promise<ChannelEntity> {
    return this.channelsService.update(+id, updateChannelDto);
  }

  @ApiOkResponse({ type: ChannelEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<ChannelEntity> {
    return this.channelsService.remove(+id);
  }

  @ApiOkResponse({ type: [MessageEntity] })
  @ApiNotFoundResponse()
  @Get(':id/messages')
  get_messages(@Param('id') id: string): Promise<MessageEntity[]> {
    return this.channelsService.get_messages(+id);
  }

  @ApiCreatedResponse({ type: MessageEntity })
  @Post(':id/messages')
  send_message(
    @Param('id') id: string,
    @Body() messageData: messageDto,
  ): Promise<MessageEntity> {
    return this.channelsService.send_message(+id, messageData);
  }

  @ApiOkResponse({ type: [RestrictionEntity] })
  @ApiNotFoundResponse()
  @Get(':id/restrictions')
  get_restrictions(@Param('id') id: string): Promise<RestrictionEntity[]> {
    return this.channelsService.get_restrictions(+id);
  }

  @ApiCreatedResponse({ type: RestrictionEntity })
  @Post(':id/messages')
  create_restriction(
    @Param('id') id: string,
    @Body() restrData: restrictionDto,
  ): Promise<RestrictionEntity> {
    return this.channelsService.create_restriction(+id, restrData);
  }
}
