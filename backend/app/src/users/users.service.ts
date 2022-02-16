import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOneOrFail(id);
      return user;
    } catch (err) {
      throw new NotFoundException();
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
}
