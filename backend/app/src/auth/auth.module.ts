import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FortyTwoStrategy } from './strategy/forty-two.strategy';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { configService } from 'src/config/config.service';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { JwtTwoFaStrategy } from './strategy/jwt-2fa.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configService.getJwtConfig().secret,
      signOptions: { expiresIn: '15 minutes' },
    }),
    forwardRef(() => UsersModule),
    TwoFactorAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, JwtStrategy, JwtTwoFaStrategy],
  exports: [AuthService],
})
export class AuthModule {}
