import {
  NotFoundException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
  forwardRef,
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
import { ChatGateway } from './chat.gateway';
import { MembersService } from './members/members.service';
import { MessagesService } from './messages/messages.service';
import { RestrictionsService } from './restrictions/restrictions.service';
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
    private messagesService: MessagesService,
    private restrictionsService: RestrictionsService,
    private membersService: MembersService,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}

  findAll(): Promise<ChannelEntity[]> {
    return this.channelsRepository.find();
  }

  async findOne(
    userId: number,
    id: number,
    include: string[] = [],
  ): Promise<ChannelEntity> {
    try {
      const channel = await this.channelsRepository.findOneOrFail(id);
      for (let index = 0; index < include.length; index++) {
        if (include[index] == 'owner')
          channel.owner = (
            await this.channelsRepository.findOne(channel.id, {
              relations: ['owner'],
            })
          ).owner;
        else if (include[index] == 'restrictions')
          channel.restrictions = await this.get_restrictions(channel.id);
        else if (include[index] == 'members')
          channel.members = await this.get_members(channel.id);
        else if (include[index] == 'messages')
          channel.messages = await this.get_messages(channel.id, userId);
      }
      return channel;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async create(owner: UserEntity, createChannelData: createChannelDto) {
    const newChannel = this.channelsRepository.create({
      title: createChannelData.title,
      isPrivate: createChannelData.isPrivate,
      password: createChannelData.password,
      ownerId: owner.id,
    });
    let savedChannel: ChannelEntity;
    try {
      savedChannel = await this.channelsRepository.save(newChannel);
    } catch (err) {
      throw new BadRequestException();
    }
    await this.add_member(savedChannel.id, owner.id, {
      isAdmin: true,
      userId: owner.id,
    });
    return savedChannel;
  }

  async update(
    id: number,
    userId: number,
    updateChannelData: updateChannelDto,
  ): Promise<ChannelEntity> {
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
        channel.members.some(
          (member) => member.userId === userId && member.isAdmin === true,
        )
      )
    )
      throw new UnauthorizedException();
    try {
      if (updateChannelData.title !== undefined)
        channel.title = updateChannelData.title;
      if (updateChannelData.isPrivate !== undefined)
        channel.isPrivate = updateChannelData.isPrivate;
      if (updateChannelData.newPassword !== undefined)
        channel.password = updateChannelData.newPassword;
      try {
        await this.channelsRepository.save(channel);
      } catch (err) {
        throw new BadRequestException();
      }
      return this.channelsRepository.findOneOrFail(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }
  async remove(id: number, userId: number): Promise<ChannelEntity> {
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
        relations: ['restrictions', 'messages', 'members'],
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
    channelId: number,
    userId: number,
    messageData: messageDto,
  ): Promise<MessageEntity> {
    let channel: ChannelEntity;
    try {
      channel = await this.channelsRepository.findOneOrFail(channelId, {
        relations: ['members', 'restrictions'],
      });
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      channel.members.some((member) => member.userId === userId) &&
      !channel.restrictions.some((restr) => restr.user.id === userId)
    ) {
      try {
        return await this.messagesService.create(
          channelId,
          userId,
          messageData,
        );
      } catch (err) {
        throw err;
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
    channelId: number,
    issuerId: number,
    restrData: restrictionDto,
  ): Promise<RestrictionEntity> {
    let channel: ChannelEntity;
    try {
      channel = await this.channelsRepository.findOneOrFail(channelId, {
        relations: ['members'],
      });
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      channel.ownerId === issuerId ||
      channel.members.some(
        (member) => member.userId === issuerId && member.isAdmin === true,
      )
    ) {
      try {
        return await this.restrictionsService.create(channelId, restrData);
      } catch (err) {
        throw err;
      }
    } else throw new UnauthorizedException();
  }

  async get_members(id: number): Promise<MemberEntity[]> {
    try {
      return (
        await this.channelsRepository.findOneOrFail(id, {
          relations: ['members'],
        })
      ).members;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async add_member(
    channelId: number,
    issuerId: number,
    memberData: memberDto,
  ): Promise<MemberEntity> {
    let channel: ChannelEntity;
    try {
      channel = await this.findOne(issuerId, channelId, ['members']);
    } catch (err) {
      throw new NotFoundException();
    }
    if (
      issuerId !== channel.ownerId &&
      !channel.members.some((member) => issuerId === member.userId) &&
      (channel.isPrivate === true ||
        (channel.password !== null &&
          channel.password !== undefined &&
          channel.password !== memberData.password))
    )
      throw new UnauthorizedException();
    let allowSetMemberPerms = false;
    if (
      (channel.ownerId === issuerId ||
        channel.members.some(
          (member) => member.userId === issuerId && member.isAdmin === true,
        )) &&
      memberData.isAdmin !== undefined &&
      memberData.isAdmin !== null
    )
      allowSetMemberPerms = true;
    try {
      const newMember = await this.membersService.create(
        channelId,
        memberData,
        allowSetMemberPerms,
      );
      this.chatGateway.broadcastNewMember(newMember);
      return newMember;
    } catch (err) {
      throw err;
    }
  }
}
