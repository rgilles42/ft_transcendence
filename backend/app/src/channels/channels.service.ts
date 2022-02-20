import {
  NotFoundException,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { MessageEntity } from 'src/_entities/channel-message.entity';
import {
  RestrictionEntity,
  restrictionType,
} from 'src/_entities/channel-restriction.entity';
import { ChannelEntity } from 'src/_entities/channel.entity';
import { UserEntity } from 'src/_entities/user.entity';
import { Repository } from 'typeorm';
import { createChannelDto } from './_dto/create-channel.dto';
import { memberDto } from './_dto/member.dto';
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
    @InjectRepository(MemberEntity)
    private membersRepository: Repository<MemberEntity>,
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
      const newMember = new MemberEntity();
      newMember.is_admin = true;
      newMember.is_owner = true;
      newMember.user = await this.usersRepository.findOneOrFail(
        createChannelData.owner_id,
      );
      await this.membersRepository.save(newMember);
      const newChannel = this.channelsRepository.create({
        type: createChannelData.type,
        password: createChannelData.password,
      });
      newChannel.members = [newMember];
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

  async get_messages(
    channel_id: number,
    user_id: number,
  ): Promise<MessageEntity[]> {
    let channel;
    try {
      channel = await this.channelsRepository.findOneOrFail(channel_id);
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      channel.restrictions.find((restr) => restr.user.id === user_id) ===
        undefined ||
      channel.restrictions.find((restr) => restr.user.id === user_id).type ===
        restrictionType.MUTE
    )
      return channel.messages;
    else throw new ForbiddenException();
  }

  async send_message(
    id: number,
    messageData: messageDto,
  ): Promise<MessageEntity> {
    try {
      const channel = await this.channelsRepository.findOneOrFail(id);
      if (
        channel.restrictions.find(
          (restr) => restr.user.id === messageData.user_id,
        ) !== undefined
      ) {
        const message = new MessageEntity();
        message.channel = channel;
        message.user = await this.usersRepository.findOneOrFail(
          messageData.user_id,
        );
        message.content = messageData.content;
        return this.messagesRepository.save(message);
      }
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

  // async create_restriction(
  //   id: number,
  //   restrData: restrictionDto,
  // ): Promise<RestrictionEntity> {
  //   try {
  //     // const channel = await this.channelsRepository.findOneOrFail(id);
  //     const restriction = new RestrictionEntity();

  //     return this.restrictionsRepository.save(restriction);
  //   } catch (err) {
  //     throw new NotFoundException();
  //   }
  // }

  async get_members(id: number): Promise<MemberEntity[]> {
    try {
      return (await this.channelsRepository.findOneOrFail(id)).members;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async add_member(id: number, memberData: memberDto): Promise<MemberEntity> {
    try {
      const channel = await this.channelsRepository.findOneOrFail(id);
      const member = new MemberEntity();
      member.channel = channel;
      member.user = await this.usersRepository.findOneOrFail(
        memberData.user_id,
      );
      if (memberData.asAdmin !== undefined)
        member.is_admin = memberData.asAdmin;
      return this.messagesRepository.save(member);
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
