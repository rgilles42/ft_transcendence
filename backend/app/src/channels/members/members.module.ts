import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { MemberEntity } from 'src/_entities/channel-member.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [MembersController],
  providers: [MembersService],
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([MemberEntity]),
    UsersModule,
  ],
  exports: [MembersService],
})
export class MembersModule {}
