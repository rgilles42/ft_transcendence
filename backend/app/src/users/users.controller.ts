import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from 'src/_entities/user.entity';
import { createUserDto } from './_dto/create-user.dto';
import { updateUserDto } from './_dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FriendshipEntity } from 'src/_entities/users_friendship.entity';
import { BlockshipEntity } from 'src/_entities/users_blockship.entity';
import { sendIdDto } from './_dto/send-id.dto';
import { ChannelEntity } from 'src/_entities/channel.entity';
import { GameEntity } from 'src/_entities/game.entity';

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

  @ApiCreatedResponse({ type: BlockshipEntity })
  @ApiNotFoundResponse()
  @Post(':id/blocked')
  block(
    @Param('id') id: string,
    @Body() blockData: sendIdDto,
  ): Promise<BlockshipEntity> {
    return this.usersService.block(+id, blockData);
  }

  @ApiOkResponse({ type: [FriendshipEntity] })
  @ApiNotFoundResponse()
  @Get(':id/friends')
  get_friends(@Param('id') id: string): Promise<FriendshipEntity[]> {
    return this.usersService.get_friends(+id);
  }

  @ApiCreatedResponse({ type: FriendshipEntity })
  @ApiNotFoundResponse()
  @Post(':id/friends')
  request_friendship(
    @Param('id') id: string,
    @Body() friendshipData: sendIdDto,
  ): Promise<FriendshipEntity> {
    return this.usersService.request_friendship(+id, friendshipData);
  }

  @ApiOkResponse({ type: [ChannelEntity] })
  @ApiNotFoundResponse()
  @Get(':id/channels')
  get_channels(@Param('id') id: string): Promise<ChannelEntity[]> {
    return this.usersService.get_channels(+id);
  }

  @ApiOkResponse({ type: [GameEntity] })
  @ApiNotFoundResponse()
  @Get(':id/games')
  get_games(@Param('id') id: string): Promise<GameEntity[]> {
    return this.usersService.get_games(+id);
  }
}
