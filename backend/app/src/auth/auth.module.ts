import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FortyTwoStrategy } from './strategy/forty-two.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { configService } from 'src/config/config.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configService.getJwtConfig().secret,
      signOptions: { expiresIn: '15 minutes' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
