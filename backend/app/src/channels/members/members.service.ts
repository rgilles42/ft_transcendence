import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity)
    private membersRepository: Repository<MemberEntity>,
  ) {}

  findAll(): Promise<MemberEntity[]> {
    return this.membersRepository.find({ relations: ['user'] });
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
