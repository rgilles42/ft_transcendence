import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { Repository } from 'typeorm';
import { memberDto } from '../_dto/member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity)
    private membersRepository: Repository<MemberEntity>,
  ) {}

  findAll(): Promise<MemberEntity[]> {
    return this.membersRepository.find();
  }

  async create(memberData: memberDto) {
    let user = null;
    try {
      user = await this.membersRepository.findOneOrFail(memberData.userId);
    } catch (err) {
      throw new NotFoundException();
    }
    const newMember = this.membersRepository.create({
      channelId: memberData.channelId,
      isAdmin: memberData.isAdmin,
      userId: user.id,
    });
    return await this.membersRepository.save(newMember);
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
