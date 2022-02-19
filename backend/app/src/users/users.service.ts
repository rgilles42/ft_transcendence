import {
  NotFoundException,
  Injectable,
  ImATeapotException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockshipEntity } from 'src/_entities/users_blockship.entity';
import { FriendshipEntity } from 'src/_entities/users_friendship.entity';
import { UserEntity } from 'src/_entities/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './_dto/create-user.dto';
import { sendIdDto } from './_dto/send-id.dto';
import { updateUserDto } from './_dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(FriendshipEntity)
    private friendshipsRepository: Repository<FriendshipEntity>,
    @InjectRepository(BlockshipEntity)
    private blockshipsRepository: Repository<BlockshipEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    try {
      if (isNaN(Number(id))) {
        throw new ImATeapotException();
      }
      const user = await this.usersRepository.findOneOrFail(Number(id));
      return user;
    } catch (err) {
      try {
        const user = await this.usersRepository.findOneOrFail({
          where: { username: id },
        });
        return user;
      } catch (err) {
        throw new NotFoundException();
      }
    }
  }

  async create(createUserData: createUserDto): Promise<UserEntity> {
    const newUser = this.usersRepository.create(createUserData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async update(id: number, updateUserData: updateUserDto): Promise<UserEntity> {
    try {
      let user = await this.usersRepository.findOneOrFail(id);
      await this.usersRepository.update(id, updateUserData);
      user = await this.usersRepository.findOne(id);
      return user;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async remove(id: number): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOneOrFail(id);
      this.usersRepository.delete(id);
      return user;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async get_blockeds(id: number): Promise<BlockshipEntity[]> {
    try {
      const user = await this.usersRepository.findOneOrFail(id, {
        relations: ['blocked_users'],
      });
      return user.blocked_users;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async block(id: number, blockData: sendIdDto): Promise<BlockshipEntity> {
    try {
      const newBlockship = new BlockshipEntity();
      newBlockship.user = await this.usersRepository.findOneOrFail(id);
      newBlockship.blocked_user = await this.usersRepository.findOneOrFail(
        blockData.target_user_id,
      );
      await this.blockshipsRepository.save(newBlockship);
      return newBlockship;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async get_friends(id: number): Promise<FriendshipEntity[]> {
    try {
      const user = await this.usersRepository.findOneOrFail(id, {
        relations: ['friends'],
      });
      return user.friends;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async request_friendship(
    id: number,
    frienshipData: sendIdDto,
  ): Promise<FriendshipEntity> {
    try {
      const newFriendship = new FriendshipEntity();
      newFriendship.user = await this.usersRepository.findOneOrFail(id);
      newFriendship.friend = await this.usersRepository.findOneOrFail(
        frienshipData.target_user_id,
      );
      await this.friendshipsRepository.save(newFriendship);
      return newFriendship;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
