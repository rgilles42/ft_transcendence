import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUserDto';
import { UserEntity } from 'src/entities/user.entity';
import { updateUserDto } from './dto/updateUserDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserData: createUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserData);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: updateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.remove(+id);
  }
}
