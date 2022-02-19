import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MessageEntity as MessageEntity } from 'src/_entities/channel-message.entity';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOkResponse({ type: MessageEntity, isArray: true })
  @Get()
  findAll(): Promise<MessageEntity[]> {
    return this.messagesService.findAll();
  }

  @ApiOkResponse({ type: MessageEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<MessageEntity> {
    return this.messagesService.remove(+id);
  }
}
