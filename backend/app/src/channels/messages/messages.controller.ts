import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtTwoFaAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';
import { MessageEntity as MessageEntity } from 'src/_entities/channel-message.entity';
import { MessagesService } from './messages.service';

@ApiTags('channel_messages')
@ApiBearerAuth('access_token')
@UseGuards(JwtTwoFaAuthGuard)
@Controller('channels/messages')
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
