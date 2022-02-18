import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/_entities/channel.entity';
import { UserEntity } from 'src/_entities/user.entity';
import { Repository } from 'typeorm';
import { createChannelDto } from './dto/create-channel.dto';
import { updateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelsRepository: Repository<ChannelEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
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
