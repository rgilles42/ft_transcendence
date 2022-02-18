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
import { UserEntity } from 'src/entities/user.entity';
import { createUserDto } from './_dto/create-user.dto';
import { updateUserDto } from './_dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FriendshipEntity } from 'src/entities/friendship.entity';
import { BlockshipEntity } from 'src/entities/blockship.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserEntity, isArray: true })
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @ApiCreatedResponse({ type: UserEntity })
  @Post()
  create(@Body() createUserData: createUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserData);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse()
  @Get(':id_or_username')
  findOne(@Param('id_or_username') id: string): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: updateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.remove(+id);
  }

  @ApiOkResponse({ type: [BlockshipEntity] })
  @ApiNotFoundResponse()
  @Get(':id/blocked')
  get_blockeds(@Param('id') id: string): Promise<BlockshipEntity[]> {
    return this.usersService.get_blockeds(+id);
  }

  @ApiOkResponse({ type: [FriendshipEntity] })
  @ApiNotFoundResponse()
  @Get(':id/friends')
  get_friends(@Param('id') id: string): Promise<FriendshipEntity[]> {
    return this.usersService.get_friends(+id);
  }
}
