import {
  NotFoundException,
  Injectable,
  ImATeapotException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockshipEntity } from 'src/_entities/users_blockship.entity';
import { FriendshipEntity } from 'src/_entities/users_friendship.entity';
import { UserEntity } from 'src/_entities/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './_dto/create-user.dto';
import { sendIdDto } from './_dto/send-id.dto';
import { updateUserDto } from './_dto/update-user.dto';
import { ChannelEntity } from 'src/_entities/channel.entity';
import { GameEntity } from 'src/_entities/game.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(FriendshipEntity)
    private friendshipsRepository: Repository<FriendshipEntity>,
    @InjectRepository(BlockshipEntity)
    private blockshipsRepository: Repository<BlockshipEntity>,
    @InjectRepository(GameEntity)
    private gamesRepository: Repository<GameEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string, include: string = null): Promise<UserEntity> {
    let user: UserEntity;
    try {
      if (isNaN(Number(id))) throw new ImATeapotException();
      user = await this.usersRepository.findOneOrFail(Number(id));
    } catch (err) {
      try {
        user = await this.usersRepository.findOneOrFail({
          where: { username: id },
        });
      } catch (err) {
        throw new NotFoundException();
      }
    }
    if (include !== null && include !== undefined) {
      const to_incl = include.split('+');
      for (let index = 0; index < to_incl.length; index++) {
        if (to_incl[index] == 'friends')
          user.friends = await this.get_friends(user.id);
        else if (to_incl[index] == 'blocked_users')
          user.blocked_users = await this.get_blockeds(user.id);
        else if (to_incl[index] == 'channels')
          user.channels = await this.get_channels(user.id);
        else throw new BadRequestException();
      }
    }
    return user;
  }

  async findOneByLogin(login: UserEntity['login']) {
    const user = await this.usersRepository.findOne({ login });
    return user;
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

  async block(
    reqUser: UserEntity,
    id: number,
    blockData: sendIdDto,
  ): Promise<BlockshipEntity> {
    if (reqUser.id != id) throw new UnauthorizedException();
    if (
      (await this.blockshipsRepository.findOne({
        where: { userId: id, blockedId: blockData.target_user_id },
      })) !== undefined
    )
      throw new BadRequestException();
    try {
      const newBlockship = new BlockshipEntity();
      newBlockship.user = await this.usersRepository.findOneOrFail(id);
      newBlockship.blockedUser = await this.usersRepository.findOneOrFail(
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
      const friends = (
        await this.usersRepository.findOneOrFail(id, {
          relations: ['friends'],
        })
      ).friends;
      const otherfriends = await this.friendshipsRepository.find({
        where: { friendId: id },
      });
      for (let index = 0; index < otherfriends.length; index++) {
        friends.push(otherfriends[index]);
      }
      return friends;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async request_friendship(
    reqUser: UserEntity,
    id: number,
    frienshipData: sendIdDto,
  ): Promise<FriendshipEntity> {
    if (reqUser.id != id) throw new UnauthorizedException();
    if (
      (await this.friendshipsRepository.findOne({
        where: { userId: id, friendId: frienshipData.target_user_id },
      })) !== undefined ||
      (await this.friendshipsRepository.findOne({
        where: { friendId: id, userId: frienshipData.target_user_id },
      })) !== undefined
    )
      throw new BadRequestException();
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

  async get_channels(id: number): Promise<ChannelEntity[]> {
    try {
      const user = await this.usersRepository.findOneOrFail(id, {
        relations: ['memberships', 'memberships.channel'],
      });
      const channels: ChannelEntity[] = [];
      for (let index = 0; index < user.memberships.length; index++) {
        channels.push(user.memberships[index].channel);
      }
      return channels;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async get_games(id: number): Promise<GameEntity[]> {
    try {
      const games = await this.gamesRepository.find({
        relations: ['player1', 'player2'],
      });
      let user_games: GameEntity[];
      // eslint-disable-next-line prefer-const
      user_games = [];
      for (let index = 0; index < games.length; index++) {
        if (games[index].player1.id === id || games[index].player2.id === id) {
          user_games.push(games[index]);
        }
      }
      return user_games;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
