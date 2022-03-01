import { ChannelEntity } from './../_entities/channel.entity';
import { UsersService } from './../users/users.service';
import {
  NotFoundException,
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { MessageEntity } from 'src/_entities/channel-message.entity';
import {
  RestrictionEntity,
  restrictionType,
} from 'src/_entities/channel-restriction.entity';
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
import bcrypt from 'bcrypt';

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
    private userService: UsersService,
  ) {}

  async findAll(user: UserEntity, include: string[] = []): Promise<any[]> {
    const relations: string[] = [];
    for (let index = 0; index < include.length; index++) {
      if (include[index] == 'owner') relations.push('owner');
      else if (include[index] == 'restrictions') relations.push('restrictions');
      else if (include[index] == 'messages') relations.push('messages');
    }
    relations.push('members');
    const channels = await this.channelsRepository.find({ relations });
    const filteredChannels: any[] = channels.filter((channel) => {
      if (!channel.isPrivate) return true;
      if (!channel.members) return false;
      return channel.members.some((member) => member.userId === user.id);
    });
    filteredChannels.forEach((element) => {
      element.hasPassword = false;
      if (element.password) element.hasPassword = true;
    });
    const safe = filteredChannels.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password: string, ...toKeep }) => toKeep,
    );
    return safe;
  }

  async findOne(
    userId: number,
    id: number,
    include: string[] = [],
  ): Promise<any> {
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
      const safe: any = channel;
      safe.hasPassword = false;
      if (safe.password) safe.hasPassword = true;
      delete safe.password;
      return safe;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async create(owner: UserEntity, createChannelData: createChannelDto) {
    const newChannel = this.channelsRepository.create({
      title: createChannelData.title,
      isPrivate: createChannelData.isPrivate,
      password: null,
      ownerId: owner.id,
    });
    if (createChannelData.password !== undefined && createChannelData.password !== null) {
      newChannel.password = bcrypt.hashSync(createChannelData.password, 10);
    }
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
    const safe: any = savedChannel;
    safe.hasPassword = false;
    if (safe.password) safe.hasPassword = true;
    delete safe.password;
    return safe;
  }

  async createPrivate(owner: UserEntity, userId: UserEntity['id']) {
    let user;
    try {
      user = await this.userService.findOne(userId.toString(), ['channels']);
    } catch {
      throw new NotFoundException();
    }
    const newChannelName = `MP ${owner.username} ${user.username}`;
    const channel = user.channels.find((find) => find.title === newChannelName);
    if (channel) {
      let findChannel;
      try {
        findChannel = await this.channelsRepository.findOne({
          id: channel.id,
        });
      } catch {
        throw new NotFoundException();
      }
      const safe: any = findChannel;
      safe.hasPassword = false;
      if (safe.password) safe.hasPassword = true;
      delete safe.password;
      return safe;
    }
    const newChannel = this.channelsRepository.create({
      title: newChannelName,
      isPrivate: true,
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
    await this.add_member(savedChannel.id, owner.id, {
      isAdmin: true,
      userId: user.id,
    });
    const safe: any = savedChannel;
    safe.hasPassword = false;
    if (safe.password) safe.hasPassword = true;
    delete safe.password;
    return safe;
  }

  isOwner(userId: number, channel: ChannelEntity) {
    return channel.ownerId === userId;
  }

  isAdmin(userId: number, channel: ChannelEntity): boolean {
    if (this.isOwner(userId, channel)) return true;
    return channel.members.some(
      (member) => member.userId === userId && member.isAdmin === true,
    );
  }

  isMember(userId: number, channel: ChannelEntity): boolean {
    if (this.isOwner(userId, channel)) return true;
    return channel.members.some((member) => member.userId === userId);
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
    if (!this.isAdmin(userId, channel)) {
      throw new ForbiddenException();
    }
    if (updateChannelData.title !== undefined)
      channel.title = updateChannelData.title;
    if (updateChannelData.isPrivate !== undefined)
      channel.isPrivate = updateChannelData.isPrivate;
    if (updateChannelData.password !== undefined) {
      if (updateChannelData.password !== null) {
        channel.password = bcrypt.hashSync(updateChannelData.password, 10);
      } else {
        channel.password = null;
      }
    }
    try {
      await this.channelsRepository.save(channel);
    } catch (err) {
      throw new BadRequestException();
    }
    try {
      const savedChannel = await this.channelsRepository.findOneOrFail(id);
      const safe: any = savedChannel;
      safe.hasPassword = false;
      if (safe.password) safe.hasPassword = true;
      delete safe.password;
      return safe;
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
    if (!this.isAdmin(userId, channel)) throw new ForbiddenException();
    this.channelsRepository.delete(id);
    const safe: any = channel;
    safe.hasPassword = false;
    if (safe.password) safe.hasPassword = true;
    delete safe.password;
    return safe;
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
    else throw new ForbiddenException();
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
      !channel.restrictions.some((restr) => restr.userId === userId)
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
    } else throw new ForbiddenException();
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
    if (this.isAdmin(issuerId, channel)) {
      try {
        const newRestriction = await this.restrictionsService.create(
          channelId,
          restrData,
        );
        return newRestriction;
      } catch (err) {
        throw err;
      }
    } else throw new ForbiddenException();
  }

  async get_members(id: number): Promise<MemberEntity[]> {
    try {
      return (
        await this.channelsRepository.findOneOrFail(id, {
          relations: ['members', 'members.user'],
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
    if (memberData.userId === undefined) {
      if (memberData.username !== undefined && memberData.username !== null) {
        try {
          memberData.userId = (
            await this.userService.findOne(memberData.username)
          ).id;
        } catch (err) {
          throw err;
        }
      }
    }
    if (!this.isMember(issuerId, channel)) {
      if (channel.isPrivate === true) {
        throw new BadRequestException({
          errors: { isPrivate: ['Le channel est privé!'] },
        });
      } else if (
        channel.password &&
        channel.password !== bcrypt.hashSync(memberData.password, 10)
      ) {
        throw new BadRequestException({
          errors: { password: ['Mot de passe incorrect!'] },
        });
      }
    }
    let allowSetMemberPerms = false;
    if (this.isAdmin(issuerId, channel) && memberData.isAdmin !== undefined)
      allowSetMemberPerms = true;
    try {
      const newMember = await this.membersService.create(
        channelId,
        memberData,
        allowSetMemberPerms,
      );
      return newMember;
    } catch (err) {
      throw err;
    }
  }
}
