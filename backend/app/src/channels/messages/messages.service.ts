import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/_entities/channel-message.entity';
import { Repository } from 'typeorm';
import { messageDto } from '../_dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
  ) {}

  findAll(): Promise<MessageEntity[]> {
    return this.messagesRepository.find();
  }

  async create(
    channelId: number,
    userId: number,
    messageData: messageDto,
  ): Promise<MessageEntity> {
    try {
      const message = new MessageEntity();
      message.channelId = channelId;
      message.userId = userId;
      message.content = messageData.content;
      return await this.messagesRepository.save(message);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async remove(id: number): Promise<MessageEntity> {
    try {
      const message = await this.messagesRepository.findOneOrFail(id);
      this.messagesRepository.delete(id);
      return message;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
