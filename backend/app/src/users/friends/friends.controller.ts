import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FriendshipEntity } from 'src/_entities/friendship.entity';
import { FriendsService } from './friends.service';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiOkResponse({ type: FriendshipEntity, isArray: true })
  @Get()
  findAll(): Promise<FriendshipEntity[]> {
    return this.friendsService.findAll();
  }

  @ApiOkResponse({ type: FriendshipEntity, isArray: true })
  @Patch(':id')
  update_status(@Param('id') id: string): Promise<FriendshipEntity> {
    return this.friendsService.update_status(+id);
  }

  @ApiOkResponse({ type: FriendshipEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<FriendshipEntity> {
    return this.friendsService.remove(+id);
  }
}
