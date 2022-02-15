import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';

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
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async create(createUserData: createUserDto): Promise<UserEntity> {
    const newUser = this.usersRepository.create({
      email: createUserData.email,
      login: createUserData.login,
      firstName: createUserData.firstName,
      lastName: createUserData.lastName,
    });
    console.log(newUser.id);
    await this.usersRepository.save(newUser);
    console.log(newUser.id);
    return newUser;
  }

  async update(id: number, updateUserData: updateUserDto): Promise<UserEntity> {
    try {
      let user = await this.usersRepository.findOneOrFail(id);
      await this.usersRepository.update(id, {
        email: updateUserData.email,
        login: updateUserData.login,
        firstName: updateUserData.firstName,
        lastName: updateUserData.lastName,
      });
      user = await this.usersRepository.findOne(id);
      return user;
    } catch (err) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: number): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOneOrFail(id);
      this.usersRepository.delete(id);
      return user;
    } catch (err) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
