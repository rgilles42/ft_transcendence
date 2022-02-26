import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FortyTwoAuthGuard } from './guards/forty-two-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { configService } from '../config/config.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async localLogin(@Request() req, @Response({ passthrough: true }) res) {
    if (configService.isProduction()) throw new NotFoundException();

    const data = await this.authService.loginWithLocal(req);

    res.cookie('access_token', data.access_token, {
      httpOnly: configService.getJwtConfig().accessToken.httpOnly,
      secure: configService.getJwtConfig().accessToken.secure,
      sameSite: configService.getJwtConfig().accessToken.sameSite,
    });

    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: configService.getJwtConfig().refreshToken.httpOnly,
      secure: configService.getJwtConfig().refreshToken.secure,
      sameSite: configService.getJwtConfig().refreshToken.sameSite,
      path: configService.getJwtConfig().refreshToken.path,
    });

    if (data.isNewUser) {
      res.status(201);
    } else {
      res.status(200);
    }

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      xsrf_token: data.xsrf_token,
      user: data.user,
    };
  }

  // Can be deleted or keep for debug in local (without front)
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/login')
  FortyTwologin() {
    return 'Success';
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('42/callback')
  async callback(@Request() req, @Response({ passthrough: true }) res) {
    const data = await this.authService.loginWithFortyTwo(req);

    res.cookie('access_token', data.access_token, {
      httpOnly: configService.getJwtConfig().accessToken.httpOnly,
      secure: configService.getJwtConfig().accessToken.secure,
      sameSite: configService.getJwtConfig().accessToken.sameSite,
    });

    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: configService.getJwtConfig().refreshToken.httpOnly,
      secure: configService.getJwtConfig().refreshToken.secure,
      sameSite: configService.getJwtConfig().refreshToken.sameSite,
      path: configService.getJwtConfig().refreshToken.path,
    });

    if (data.isNewUser) {
      res.status(201);
    } else {
      res.status(200);
    }

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      xsrf_token: data.xsrf_token,
      user: data.user,
    };
  }

  @Post('refresh')
  async refreshTokens(@Request() req, @Response({ passthrough: true }) res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh not found');
    }
    const data = await this.authService.refreshTokens(refreshToken);

    res.cookie('access_token', data.access_token, {
      httpOnly: configService.getJwtConfig().accessToken.httpOnly,
      secure: configService.getJwtConfig().accessToken.secure,
      sameSite: configService.getJwtConfig().accessToken.sameSite,
    });

    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: configService.getJwtConfig().refreshToken.httpOnly,
      secure: configService.getJwtConfig().refreshToken.secure,
      sameSite: configService.getJwtConfig().refreshToken.sameSite,
      path: configService.getJwtConfig().refreshToken.path,
    });

    return data;
  }

  @Post('logout')
  logout(@Response({ passthrough: true }) res) {
    res.cookie('access_token', false, {
      httpOnly: configService.getJwtConfig().accessToken.httpOnly,
      secure: configService.getJwtConfig().accessToken.secure,
      sameSite: configService.getJwtConfig().accessToken.sameSite,
    });

    res.cookie('refresh_token', false, {
      httpOnly: configService.getJwtConfig().refreshToken.httpOnly,
      secure: configService.getJwtConfig().refreshToken.secure,
      sameSite: configService.getJwtConfig().refreshToken.sameSite,
      path: configService.getJwtConfig().refreshToken.path,
    });
    return 'Success';
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  test() {
    return 'test';
  }
}
