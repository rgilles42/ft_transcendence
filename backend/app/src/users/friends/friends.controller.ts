import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtTwoFaAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';
import { FriendshipEntity } from 'src/_entities/users_friendship.entity';
import { FriendsService } from './friends.service';

@ApiTags('users_friends')
@ApiBearerAuth('access_token')
@UseGuards(JwtTwoFaAuthGuard)
@Controller('/users/friends')
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
