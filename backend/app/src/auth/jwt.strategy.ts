import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authServe: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET', // TODO: to env (same as the other SECRET)
    }); // config
  }

  async validate(payload: any): Promise<any> {
    // const user = await this.userService.getById(payload.sub);
    return {
      id: payload.sub,
      name: payload.name,
    };
  }
}
