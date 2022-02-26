import {
  NotFoundException,
  Injectable,
  UnauthorizedException,
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

  // async create(
  //   ownerId: number,
  //   createChannelData: createChannelDto,
  // ): Promise<ChannelEntity> {
  //   try {
  //     const newMember = new MemberEntity();
  //     newMember.isAdmin = true;
  //     newMember.user = await this.usersRepository.findOneOrFail(ownerId);
  //     await this.membersRepository.save(newMember);
  //     const newChannel = this.channelsRepository.create({
  //       isPrivate: createChannelData.isPrivate,
  //       password: createChannelData.password,
  //     });
  //     newChannel.owner = newMember.user;
  //     newChannel.members = [newMember];
  //     await this.channelsRepository.save(newChannel);
  //     return newChannel;
  //   } catch (err) {
  //     throw new NotFoundException();
  //   }
  // }

  async create(owner: UserEntity, createChannelData: createChannelDto) {
    const newChannel = this.channelsRepository.create({
      isPrivate: createChannelData.isPrivate,
      password: createChannelData.password,
      ownerId: owner.id,
    });
    const savedChannel = await this.channelsRepository.save(newChannel);
    const ownerMember = this.membersRepository.create({
      channelId: savedChannel.id,
      isAdmin: true,
      userId: owner.id,
    });
    const newOwnerMember = await this.membersRepository.save(ownerMember);
    savedChannel.members = [newOwnerMember];
    return savedChannel;
  }

  async update(
    id: number,
    userId: number,
    updateChannelData: updateChannelDto,
  ): Promise<ChannelEntity> {
    let channel: ChannelEntity;
    try {
      channel = await this.channelsRepository.findOneOrFail(id);
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      !(
        channel.ownerId === userId ||
        channel.members.some(
          (member) => member.userId === userId && member.isAdmin === true,
        )
      )
    )
      throw new UnauthorizedException();
    try {
      if (updateChannelData.channelType !== undefined)
        channel.isPrivate = updateChannelData.channelType;
      if (updateChannelData.newPassword !== undefined)
        channel.password = updateChannelData.newPassword;
      await this.channelsRepository.save(channel);
      return this.channelsRepository.findOneOrFail(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }
  async remove(id: number, userId: number): Promise<ChannelEntity> {
    let channel: ChannelEntity;
    try {
      channel = await this.channelsRepository.findOneOrFail(id);
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      !(
        channel.ownerId === userId ||
        channel.members.some(
          (member) => member.userId === userId && member.isAdmin === true,
        )
      )
    )
      throw new UnauthorizedException();
    this.channelsRepository.delete(id);
    return channel;
  }

  async get_messages(
    channel_id: number,
    userId: number,
  ): Promise<MessageEntity[]> {
    let channel: ChannelEntity;
    try {
      channel = await this.channelsRepository.findOneOrFail(channel_id, {
        relations: ['restrictions', 'messages'],
      });
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      channel.members.some((member) => member.userId === userId) &&
      (!channel.restrictions.some((restr) => restr.userId === userId) ||
        channel.restrictions.find((restr) => restr.userId === userId).type ===
          restrictionType.MUTE)
    )
      return channel.messages;
    else throw new UnauthorizedException();
  }

  async send_message(
    id: number,
    userId: number,
    messageData: messageDto,
  ): Promise<MessageEntity> {
    let channel: ChannelEntity;
    try {
      channel = await this.channelsRepository.findOneOrFail(id, {
        relations: ['members'],
      });
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      channel.members.some((member) => member.userId === userId) &&
      !channel.restrictions.some((restr) => restr.user.id === userId)
    ) {
      try {
        const message = new MessageEntity();
        message.channel = channel;
        message.userId = userId;
        message.content = messageData.content;
        return await this.messagesRepository.save(message);
      } catch (err) {
        throw new NotFoundException();
      }
    } else throw new UnauthorizedException();
  }

  async get_restrictions(id: number): Promise<RestrictionEntity[]> {
    try {
      return (
        await this.channelsRepository.findOneOrFail(id, {
          relations: ['restrictions'],
        })
      ).restrictions;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async create_restriction(
    channel_id: number,
    issuerId: number,
    restrData: restrictionDto,
  ): Promise<RestrictionEntity> {
    let channel: ChannelEntity;
    try {
      channel = await this.channelsRepository.findOneOrFail(channel_id, {
        relations: ['members'],
      });
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      channel.ownerId == issuerId ||
      channel.members.some(
        (member) => member.userId === issuerId && member.isAdmin === true,
      )
    ) {
      try {
        const restriction = new RestrictionEntity();
        restriction.channel = channel;
        restriction.userId = restrData.targetUserId;
        restriction.type = restrData.type;
        restriction.endAt = restrData.endDate;
        return await this.restrictionsRepository.save(restriction);
      } catch (err) {
        throw new NotFoundException();
      }
    } else throw new UnauthorizedException();
  }

  async get_members(id: number): Promise<MemberEntity[]> {
    try {
      return (await this.channelsRepository.findOneOrFail(id)).members;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async add_member(
    id: number,
    userId: number,
    memberData: memberDto,
  ): Promise<MemberEntity> {
    let channel: ChannelEntity;
    try {
      channel = await this.channelsRepository.findOneOrFail(id, {
        relations: ['members'],
      });
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      !(
        channel.ownerId === userId ||
        channel.members.some((member) => member.userId === userId)
      ) &&
      (channel.isPrivate === true || userId !== memberData.userId)
    )
      throw new UnauthorizedException();
    if (
      !(
        channel.ownerId === userId ||
        channel.members.some((member) => member.userId === userId)
      ) &&
      channel.password !== null &&
      channel.password !== undefined
    ) {
      // && memberData.password !== channel.password
      throw new UnauthorizedException();
    }
    const member = new MemberEntity();
    member.channel = channel;
    member.userId = memberData.userId;
    if (
      (channel.ownerId === userId ||
        channel.members.some(
          (member) => member.userId === userId && member.isAdmin === true,
        )) &&
      memberData.isAdmin !== undefined &&
      memberData.isAdmin !== null
    )
      member.isAdmin = memberData.isAdmin;
    return await this.membersRepository.save(member);
  }
}
