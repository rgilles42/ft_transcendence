import { JwtAuthGuard } from './jwt-auth.guard';
import { ForthyTwoAuthGuard } from './forty-two-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ForthyTwoAuthGuard)
  @Get('42/login')
  login(): any {
    return { msg: 'logged In' };
  }

  @Get('42/callback')
  callback(): any {
    return { msg: 'logged In' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  helloWorld(): string {
    return 'Hello World';
  }
}
