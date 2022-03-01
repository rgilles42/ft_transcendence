import {
  Controller,
  Get,
  Param,
  Response,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import * as path from 'path';
import { Observable } from 'rxjs';
import { JwtTwoFaAuthGuard } from 'src/auth/guards/jwt-2fa-auth.guard';
import { StorageService } from './storage.service';

@ApiTags('storage')
@Controller('storage')
@ApiBearerAuth('access_token')
@UseGuards(JwtTwoFaAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiOkResponse({ type: Observable })
  @Get('usersAvatars/:filename')
  async getAvatar(@Param('filename') filename: string, @Response() res) {
    try {
      const filePath = await this.storageService.getAvatar(filename, true);
      res.sendFile(path.join(process.cwd(), filePath));
    } catch {
      throw new NotFoundException();
    }
  }
}
