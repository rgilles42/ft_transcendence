import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/_entities/channel-message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
  ) {}

  findAll(): Promise<MessageEntity[]> {
    return this.messagesRepository.find();
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
