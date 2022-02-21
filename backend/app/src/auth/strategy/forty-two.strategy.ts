import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { configService } from 'src/config/config.service';
import { Strategy } from 'passport-42';

@Injectable()
export class ForthyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private authServe: AuthService) {
    super(configService.getForthyTwoStrategyConfig()); // config
  }

  public authenticate(req, options) {
    if (req.query.redirectUrl) {
      options.callbackURL = req.query.redirectUrl;
    }
    super.authenticate(req, options);
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    if (!profile) throw new UnauthorizedException();
    const user = {
      login: profile.username,
      imageUrl: profile.photos[0].value,
    };
    return user;
  }

  // validate(accessToken: string) {
  //   return new Promise((resolve, reject) => {
  //     this.userProfile(`${accessToken}z`, (err, profile) => {
  //       if (err !== undefined && err !== null) {
  //         console.log(err);
  //         reject(err);
  //         return;
  //       }
  //       if (!profile) {
  //         reject(new UnauthorizedException());
  //         return;
  //       }
  //       const user = {
  //         login: profile.username,
  //         imageUrl: profile.photos[0].value,
  //       };
  //       resolve(user);
  //     });
  //   });
  // }
}
