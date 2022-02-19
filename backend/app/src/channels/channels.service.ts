import {
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/_entities/channel-message.entity';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';
import { ChannelEntity } from 'src/_entities/channel.entity';
import { UserEntity } from 'src/_entities/user.entity';
import { Repository } from 'typeorm';
import { createChannelDto } from './_dto/create-channel.dto';
import { messageDto } from './_dto/message.dto';
import { restrictionDto } from './_dto/restriction.dto';
import { updateChannelDto } from './_dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelsRepository: Repository<ChannelEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
    @InjectRepository(RestrictionEntity)
    private restrictionsRepository: Repository<RestrictionEntity>,
  ) {}

  findAll(): Promise<ChannelEntity[]> {
    return this.channelsRepository.find();
  }

  async findOne(id: number): Promise<ChannelEntity> {
    try {
      const channel = await this.channelsRepository.findOneOrFail(id);
      return channel;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async create(createChannelData: createChannelDto): Promise<ChannelEntity> {
    try {
      const newChannel = this.channelsRepository.create({
        type: createChannelData.type,
        password: createChannelData.password,
      });
      newChannel.owner = await this.usersRepository.findOneOrFail(
        createChannelData.owner,
      );
      newChannel.members = [newChannel.owner];
      newChannel.admins = [newChannel.owner];
      await this.channelsRepository.save(newChannel);
      return newChannel;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async update(
    id: number,
    updateChannelData: updateChannelDto,
  ): Promise<ChannelEntity> {
    let channel: ChannelEntity;
    try {
      channel = await this.channelsRepository.findOneOrFail(id);
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      channel.password !== null &&
      updateChannelData.channel_password !== channel.password
    )
      throw new BadRequestException();
    try {
      if (updateChannelData.new_channel_type !== undefined)
        channel.type = updateChannelData.new_channel_type;
      if (updateChannelData.new_password !== undefined)
        channel.password = updateChannelData.new_password;
      if (updateChannelData.new_user_id !== undefined) {
        const user = await this.usersRepository.findOneOrFail(
          updateChannelData.new_user_id,
        );
        channel.members.push(user);
        if (updateChannelData.make_admin_as_well === true) {
          channel.admins.push(user);
        }
      }
      await this.channelsRepository.save(channel);
      return this.channelsRepository.findOneOrFail(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }
  async remove(id: number): Promise<ChannelEntity> {
    try {
      const channel = await this.channelsRepository.findOneOrFail(id);
      this.channelsRepository.delete(id);
      return channel;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async get_messages(id: number): Promise<MessageEntity[]> {
    try {
      return (await this.channelsRepository.findOneOrFail(id)).messages;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async send_message(
    id: number,
    messageData: messageDto,
  ): Promise<MessageEntity> {
    try {
      //TODO
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async get_restrictions(id: number): Promise<RestrictionEntity[]> {
    try {
      return (await this.channelsRepository.findOneOrFail(id)).restrictions;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async create_restriction(
    id: number,
    restrData: restrictionDto,
  ): Promise<RestrictionEntity> {
    try {
      //TODO
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
