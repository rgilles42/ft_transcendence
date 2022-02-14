import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
