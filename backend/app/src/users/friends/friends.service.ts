import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FriendshipEntity,
  friendshipStatus,
} from 'src/_entities/users_friendship.entity';
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
      await this.friendshipsRepository.save(friendship);

      const friendship2 = new FriendshipEntity();
      friendship2.user = friendship.friend;
      friendship2.friend = friendship.user;
      friendship2.status = friendshipStatus.ACCEPTED;
      await this.friendshipsRepository.save(friendship2);
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
      const matching_friendship = await this.friendshipsRepository.findOne({
        relations: ['user'],
        where: { user: friendship.friend, friend: friendship.user },
      });
      await this.friendshipsRepository.delete(id);
      if (matching_friendship !== undefined) {
        await this.friendshipsRepository.delete(
          matching_friendship.friendship_id,
        );
      }
      return friendship;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
