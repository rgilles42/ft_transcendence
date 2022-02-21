import { JwtStrategy } from './jwt.strategy';
import { ForthyTwoStrategy } from './forty-two.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SECRET', // TODO: to env (same as the other SECRET)
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ForthyTwoStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
