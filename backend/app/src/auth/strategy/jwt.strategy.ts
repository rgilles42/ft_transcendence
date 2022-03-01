import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { configService } from 'src/config/config.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authServe: AuthService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          const accessToken = req?.cookies['access_token'];
          if (!accessToken) {
            return null;
          }
          return accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtConfig().secret,
      passReqToCallback: true,
    }); // config
  }

  async validate(req, payload: any): Promise<any> {
    if (!payload) {
      throw new UnauthorizedException('Missing payload');
    }
    // if (!req.headers || !req.headers['x-xsrf-token']) {
    //   throw new UnauthorizedException('Missing xsrf token');
    // }
    // if (req.headers['x-xsrf-token'] !== payload.xsrfToken) {
    //   throw new UnauthorizedException('Invalid xsrf token');
    // }
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
