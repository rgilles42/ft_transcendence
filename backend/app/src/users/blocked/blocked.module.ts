import { Module } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { BlockedController } from './blocked.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { BlockshipEntity } from 'src/_entities/blockship.entity';

@Module({
  providers: [BlockedService],
  controllers: [BlockedController],
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([BlockshipEntity]),
  ],
})
export class BlockedModule {}
