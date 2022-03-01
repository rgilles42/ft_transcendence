import { UserEntity } from 'src/_entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { Repository } from 'typeorm';
import { ChatGateway } from '../chat.gateway';
import { memberDto } from '../_dto/member.dto';
import { updateMemberDto } from './../_dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity)
    private membersRepository: Repository<MemberEntity>,
    private usersService: UsersService,
    private chatGateway: ChatGateway,
  ) {}

  findAll(): Promise<MemberEntity[]> {
    return this.membersRepository.find();
  }

  async create(
    channelId: number,
    memberData: memberDto,
    allowSetMemberPerms: boolean,
  ): Promise<MemberEntity> {
    let user: UserEntity;
    try {
      user = await this.usersService.findOne(memberData.userId.toString());
    } catch (err) {
      throw new NotFoundException();
    }
    const member = new MemberEntity();
    member.channelId = channelId;
    member.userId = memberData.userId;
    if (allowSetMemberPerms) member.isAdmin = memberData.isAdmin;
    else member.isAdmin = false;
    try {
      const newMember = await this.membersRepository.save(member);
      newMember.user = user;
      this.chatGateway.broadcastNewMember(newMember);
      return newMember;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async update(
    id: number,
    updateMemberDto: updateMemberDto,
  ): Promise<MemberEntity> {
    let member: MemberEntity;
    try {
      member = await this.membersRepository.findOneOrFail(id);
    } catch (err) {
      throw new NotFoundException();
    }
    member.isAdmin = updateMemberDto.isAdmin;
    try {
      return await this.membersRepository.save(member);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async remove(id: number): Promise<MemberEntity> {
    try {
      const member = await this.membersRepository.findOneOrFail(id);
      this.membersRepository.delete(id);
      this.chatGateway.broadcastDeleteMember(member);
      return member;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
