import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BlockshipEntity } from 'src/_entities/users_blockship.entity';
import { BlockedService } from './blocked.service';

@ApiTags('users_blocked')
@Controller('blocked')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @ApiOkResponse({ type: BlockshipEntity, isArray: true })
  @Get()
  findAll(): Promise<BlockshipEntity[]> {
    return this.blockedService.findAll();
  }

  @ApiOkResponse({ type: BlockshipEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<BlockshipEntity> {
    return this.blockedService.remove(+id);
  }
}
