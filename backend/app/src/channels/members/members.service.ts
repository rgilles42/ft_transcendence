import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { ChannelEntity } from 'src/_entities/channel.entity';
import { Repository } from 'typeorm';
import { memberDto } from '../_dto/member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity)
    private membersRepository: Repository<MemberEntity>,
    private usersService: UsersService,
  ) {}

  findAll(): Promise<MemberEntity[]> {
    return this.membersRepository.find();
  }

  async create(
    channel: ChannelEntity,
    issuerId: number,
    memberData: memberDto,
  ): Promise<MemberEntity> {
    try {
      await this.usersService.findOne(memberData.userId.toString());
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
    const member = new MemberEntity();
    member.channelId = channel.id;
    member.userId = memberData.userId;
    if (
      (channel.ownerId === issuerId ||
        channel.members.some(
          (member) => member.userId === issuerId && member.isAdmin === true,
        )) &&
      memberData.isAdmin !== undefined &&
      memberData.isAdmin !== null
    )
      member.isAdmin = memberData.isAdmin;
    try {
      return await this.membersRepository.save(member);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async remove(id: number): Promise<MemberEntity> {
    try {
      const message = await this.membersRepository.findOneOrFail(id);
      this.membersRepository.delete(id);
      return message;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
