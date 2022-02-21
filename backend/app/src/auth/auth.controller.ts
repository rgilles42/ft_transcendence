import { FortyTwoAuthGuard } from './guards/forty-two-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Can be deleted or keep for debug in local (without front)
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/login')
  login() {
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
