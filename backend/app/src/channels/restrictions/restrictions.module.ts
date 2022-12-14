import { ChannelsModule } from './../channels.module';
import { forwardRef, Module } from '@nestjs/common';
import { RestrictionsController } from './restrictions.controller';
import { RestrictionsService } from './restrictions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { RestrictionEntity } from 'src/_entities/channel-restriction.entity';

@Module({
  controllers: [RestrictionsController],
  providers: [RestrictionsService],
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([RestrictionEntity]),
    forwardRef(() => ChannelsModule),
  ],
  exports: [RestrictionsService],
})
export class RestrictionsModule {}
