import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/entities/channel.entity';
import { Repository } from 'typeorm';
import { createChannelDto } from './dto/create-channel.dto';
import { updateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelsRepository: Repository<ChannelEntity>,
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
    const newChannel = this.channelsRepository.create(createChannelData);
    await this.channelsRepository.save(newChannel);
    return newChannel;
  }

  async update(
    id: number,
    updateChannelData: updateChannelDto,
  ): Promise<ChannelEntity> {
    try {
      let channel = await this.channelsRepository.findOneOrFail(id);
      await this.channelsRepository.update(id, updateChannelData);
      channel = await this.channelsRepository.findOne(id);
      return channel;
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
}
