import { configService } from 'src/config/config.service';
import { UserEntity } from './../_entities/user.entity';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isStringObject } from 'util/types';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  public createTokens(user: UserEntity, isTwoFaAuthenticated = false) {
    const xsrfToken = randomBytes(64).toString('hex');

    const payload = {
      isTwoFaAuthenticated,
      id: user.id,
      login: user.login,
      username: user.username,
      xsrfToken,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: configService.getJwtConfig().accessToken.maxAge, // 15 minutes
      subject: user.id.toString(),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: configService.getJwtConfig().refreshToken.maxAge, // 30 days
      subject: user.id.toString(),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      xsrf_token: xsrfToken,
    };
  }

  public async refreshTokens(refreshToken: string) {
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh is expired');
    }
    if (!decodedToken || isStringObject(decodedToken)) {
      throw new UnauthorizedException('Invalid payload');
    }

    const user = await this.usersService.findOne(decodedToken.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.createTokens(user);
  }

  async loginWithLocal(req) {
    if (!req.body.login) throw new BadRequestException();
    let user = await this.usersService.findOneByLogin(req.body.login, [
      'friends',
      'blockedUsers',
      'channels',
      'games',
    ]);
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await this.usersService.create({
        login: req.body.login,
        username: req.body.login,
        imageUrl: null,
      });
    }
    const tokens = this.createTokens(user);
    if (user.isTwoFactorEnable) {
      return {
        access_token: tokens.access_token,
        refresh_token: undefined,
        xsrf_token: undefined,
        user: undefined,
        isNewUser: undefined,
        isTwoFactorEnable: user.isTwoFactorEnable,
      };
    }
    return {
      ...tokens,
      user,
      isNewUser,
      isTwoFactorEnable: user.isTwoFactorEnable,
    };
  }

  async loginWithFortyTwo(req) {
    if (!req.user) throw new BadRequestException();
    let user = await this.usersService.findOneByLogin(req.user.login, [
      'friends',
      'blockedUsers',
      'channels',
      'games',
    ]);
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await this.usersService.create({
        login: req.user.login,
        username: req.user.login,
        imageUrl: req.user.imageUrl,
      });
    }
    const tokens = this.createTokens(user);
    if (user.isTwoFactorEnable) {
      return {
        access_token: tokens.access_token,
        refresh_token: undefined,
        xsrf_token: undefined,
        user: undefined,
        isNewUser: undefined,
        isTwoFactorEnable: user.isTwoFactorEnable,
      };
    }
    return {
      ...tokens,
      user,
      isNewUser,
      isTwoFactorEnable: user.isTwoFactorEnable,
    };
  }

  public verifyJwt(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
