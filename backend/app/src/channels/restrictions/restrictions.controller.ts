import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtTwoFaAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';
import { RestrictionsService } from './restrictions.service';

@ApiTags('channel_restrictions')
@ApiBearerAuth('access_token')
@UseGuards(JwtTwoFaAuthGuard)
@Controller('channels/restrictions')
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
