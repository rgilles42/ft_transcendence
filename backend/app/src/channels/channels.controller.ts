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
import { ChannelEntity } from 'src/entities/channel.entity';
import { createChannelDto } from './dto/create-channel.dto';
import { updateChannelDto } from './dto/update-channel.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
    constructor(private readonly channelsService: ChannelsService) {}

    @ApiOkResponse({ type: ChannelEntity, isArray: true })
    @Get()
    findAll(): Promise<ChannelEntity[]> {
      return this.channelsService.findAll();
    }

    @ApiOkResponse({ type: ChannelEntity })
    @ApiNotFoundResponse()
    @Get(':id')
    findOne(@Param('id') id: string): Promise<ChannelEntity> {
      return this.channelsService.findOne(+id);
    }

    @ApiCreatedResponse({ type: ChannelEntity })
    @Post()
    create(@Body() createChannelData: createChannelDto): Promise<ChannelEntity> {
      return this.channelsService.create(createChannelData);
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

}