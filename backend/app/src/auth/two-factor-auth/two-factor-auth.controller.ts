import { UserEntity } from 'src/_entities/user.entity';
import {
  Controller,
  UseGuards,
  Post,
  Res,
  Body,
  BadRequestException,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TwoFaAuthDto } from './_dto/two-fa-auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Response } from 'express';
import { GetUser } from '../decorators/get-user.decorator';
import { configService } from 'src/config/config.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('auth Two FA')
@Controller('/auth/2fa')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Get('generate')
  async generateQrCode(@Res() response: Response, @GetUser() user: UserEntity) {
    const { otpAuthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(user);
    response.setHeader('content-type', 'image/png');
    return this.twoFactorAuthService.qrCodeStreamPipe(response, otpAuthUrl);
  }

  @Post('enable')
  async activationOfTwoFa(
    @GetUser() user: UserEntity,
    @Body() twoFaAuthDto: TwoFaAuthDto,
  ) {
    if (user.isTwoFactorEnable) {
      throw new BadRequestException({
        errors: { code: ['2fa is already enabled!'] },
      });
    }
    const isCodeValid = await this.twoFactorAuthService.verifyTwoFaCode(
      twoFaAuthDto.code,
      user,
    );
    if (!isCodeValid) {
      throw new BadRequestException({
        errors: { code: ['Invalid authentication code!'] },
      });
    }
    await this.twoFactorAuthService.activationOfTwoFa(user.login, true);
  }

  @Delete('disable')
  async disactivationOfTwoFa(
    @GetUser() user: UserEntity,
    @Query() twoFaAuthDto: TwoFaAuthDto,
  ) {
    if (!user.isTwoFactorEnable) {
      throw new BadRequestException({
        errors: { code: ['2fa is already disabled!'] },
      });
    }
    const isCodeValid = await this.twoFactorAuthService.verifyTwoFaCode(
      twoFaAuthDto.code,
      user,
    );
    if (!isCodeValid) {
      throw new BadRequestException({
        errors: { code: ['Invalid authentication code!'] },
      });
    }
    await this.twoFactorAuthService.disableTwoFa(user.login);
  }

  // This function will be called if 2FA is on (activationOfTwoFa method)
  @Post('authenticate')
  async authenticate(
    @GetUser() user: UserEntity,
    @Body() twoFaAuthDto: TwoFaAuthDto,
    @Res({ passthrough: true }) res,
  ) {
    if (!user.isTwoFactorEnable) {
      throw new BadRequestException({
        errors: { code: ["2fa isn't enabled!"] },
      });
    }
    const isCodeValid = await this.twoFactorAuthService.verifyTwoFaCode(
      twoFaAuthDto.code,
      user,
    );
    if (!isCodeValid) {
      throw new BadRequestException({
        errors: { code: ['Invalid authentication code!'] },
      });
    }
    const data = await this.twoFactorAuthService.loginWithTwoFactor(user, true);

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
}
