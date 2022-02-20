import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';
import { RestrictionsService } from './restrictions.service';

@ApiTags('channel_restrictions')
@Controller('restrictions')
export class RestrictionsController {
  constructor(private readonly restrictionsService: RestrictionsService) {}

  @ApiOkResponse({ type: RestrictionEntity, isArray: true })
  @Get()
  findAll(): Promise<RestrictionEntity[]> {
    return this.restrictionsService.findAll();
  }

  @ApiOkResponse({ type: RestrictionEntity })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<RestrictionEntity> {
    return this.restrictionsService.remove(+id);
  }
}
