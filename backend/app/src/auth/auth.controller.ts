import { ForthyTwoAuthGuard } from './guards/forty-two-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ForthyTwoAuthGuard)
  @Get('42/login')
  login(@Request() req) {
    console.log(req);
  }

  @UseGuards(ForthyTwoAuthGuard)
  @Get('42/callback')
  async callback(@Request() req) {
    return this.authService.loginWithForthyTwo(req);
  }

  @Post('refresh')
  helloWorld(@Request() req) {
    return this.authService.refreshTokens(this.authService.getReqToken(req));
  }
}
