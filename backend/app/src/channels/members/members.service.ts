import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { MemberEntity } from 'src/_entities/channel-member.entity';
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
    channelId: number,
    memberData: memberDto,
    allowSetMemberPerms: boolean,
  ): Promise<MemberEntity> {
    try {
      await this.usersService.findOne(memberData.userId.toString());
    } catch (err) {
      throw new NotFoundException();
    }
    const member = new MemberEntity();
    member.channelId = channelId;
    member.userId = memberData.userId;
    if (allowSetMemberPerms) member.isAdmin = memberData.isAdmin;
    else member.isAdmin = false;
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
