import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipEntity } from 'src/_entities/users_friendship.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendshipEntity)
    private friendshipsRepository: Repository<FriendshipEntity>,
  ) {}

  findAll(): Promise<FriendshipEntity[]> {
    return this.friendshipsRepository.find({});
  }

  async update_status(id: number): Promise<FriendshipEntity> {
    try {
      const friendship = await this.friendshipsRepository.findOneOrFail(id);
      friendship.status = true;
      try {
        await this.friendshipsRepository.save(friendship);
      } catch (err) {
        throw new BadRequestException();
      }
      return friendship;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async remove(id: number): Promise<FriendshipEntity> {
    try {
      const friendship = await this.friendshipsRepository.findOneOrFail(id);
      await this.friendshipsRepository.delete(id);
      return friendship;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
