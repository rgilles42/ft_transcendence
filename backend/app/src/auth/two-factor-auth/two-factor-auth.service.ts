import { configService } from 'src/config/config.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/_entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  public async generateTwoFactorAuthSecret(user: UserEntity) {
    const auth = await this.userRepository.findOne({ login: user.login });
    if (auth) {
      if (auth.isTwoFactorEnable) {
        return {
          msg: 'Already QR generated',
        };
      }
    }

    const secret = authenticator.generateSecret();
    const app_name = configService.getAppName();
    const otpAuthUrl = authenticator.keyuri(user.username, app_name, secret);

    await this.userRepository.update(
      { login: user.login },
      { twoFactorAuthSecret: secret },
    );
    return {
      secret,
      otpAuthUrl,
    };
  }

  public async qrCodeStreamPipe(stream: Response, otpPathUrl: string) {
    return toFileStream(stream, otpPathUrl);
  }

  public async activationOfTwoFa(login: string, status: boolean) {
    return await this.userRepository.update(
      { login },
      { isTwoFactorEnable: status },
    );
  }

  public async disableTwoFa(login: string) {
    return await this.userRepository.update(
      { login },
      { isTwoFactorEnable: false, twoFactorAuthSecret: null },
    );
  }

  public async verifyTwoFaCode(code: string, user: UserEntity) {
    if (user.twoFactorAuthSecret === undefined || user.twoFactorAuthSecret === null) {
      throw new BadRequestException({
        errors: { code: ['You must generate the QR code before!'] },
      });
    }
    return authenticator.verify({
      token: code,
      secret: user.twoFactorAuthSecret,
    });
  }

  async loginWithTwoFactor(user: UserEntity, isTwoFaAuthenticated: boolean) {
    const tokens = await this.authService.createTokens(
      user,
      isTwoFaAuthenticated,
    );
    return {
      ...tokens,
      user,
      isNewUser: false,
    };
  }
}
