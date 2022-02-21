import { UserEntity } from './../_entities/user.entity';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isStringObject } from 'util/types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  validateUser(): Promise<any> {
    console.log('validate me');
    return null;
  }

  public getReqToken(req): string {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }

  public createTokens({ id, login, username }: UserEntity) {
    const payload = {
      id: id,
      login: login,
      username: username,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '15 minutes',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '30 days',
      }),
    };
  }

  public async refreshTokens(refreshToken: string) {
    const decodedToken = this.jwtService.decode(refreshToken);
    if (!decodedToken || isStringObject(decodedToken)) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne(decodedToken.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.createTokens(user);
  }

  async loginWithFortyTwo(req) {
    if (!req.user) throw new BadRequestException();
    let user = await this.usersService.findOneByLogin(req.user.login);
    if (!user) {
      user = await this.usersService.create({
        login: req.user.login,
        username: req.user.login,
        imageUrl: req.user.imageUrl,
      });
    }
    return {
      ...this.createTokens(user),
      user,
    };
  }
}
