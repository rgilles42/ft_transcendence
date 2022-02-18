import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FriendshipEntity,
  friendshipStatus,
} from 'src/entities/friendship.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendshipEntity)
    private friendshipsRepository: Repository<FriendshipEntity>,
  ) {}

  findAll(): Promise<FriendshipEntity[]> {
    return this.friendshipsRepository.find({
      relations: ['user'],
    });
  }

  async update_status(id: number): Promise<FriendshipEntity> {
    try {
      const friendship = await this.friendshipsRepository.findOneOrFail(id, {
        relations: ['user'],
      });
      friendship.status = friendshipStatus.ACCEPTED;
      this.friendshipsRepository.save(friendship);
      return friendship;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async remove(id: number): Promise<FriendshipEntity> {
    try {
      const friendship = await this.friendshipsRepository.findOneOrFail(id, {
        relations: ['user'],
      });
      this.friendshipsRepository.delete(id);
      return friendship;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
