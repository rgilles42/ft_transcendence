import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class ForthyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private authServe: AuthService) {
    super({
      clientID:
        'd06344c477bb785a0c3620e07adb3e549c236542a625f06f8bf03dee468f93fa',
      clientSecret:
        'fe9d3269663db3c6dfd48342a3b574d87fd9abdd08bb5b186d1b1227a8551450',
      callbackURL: 'http://127.0.0.1:3000/auth/42/callback',
    }); // config
  }

  async validate(): Promise<any> {
    console.log('test');
    return null;
  }
}
