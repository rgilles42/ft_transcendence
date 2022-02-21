import { FortyTwoAuthGuard } from './guards/forty-two-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { configService } from '../config/config.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  localLogin(@Request() req) {
    if (configService.isProduction()) throw new NotFoundException();
    return this.authService.loginWithLocal(req);
  }

  // Can be deleted or keep for debug in local (without front)
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/login')
  FortyTwologin() {
    return 'Success';
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('42/callback')
  callback(@Request() req) {
    return this.authService.loginWithFortyTwo(req);
  }

  @Post('refresh')
  helloWorld(@Request() req) {
    return this.authService.refreshTokens(this.authService.getReqToken(req));
  }

  @Post('logout')
  logout() {
    return 'Success';
  }
}
