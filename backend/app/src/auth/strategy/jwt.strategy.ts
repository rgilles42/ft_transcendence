import { UsersService } from './../../users/users.service';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { configService } from 'src/config/config.service';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authServe: AuthService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtConfig().secret,
    }); // config
  }

  async validate(payload: any): Promise<any> {
    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne(payload.id);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
