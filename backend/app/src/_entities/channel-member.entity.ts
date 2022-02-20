import { ApiProperty } from '@nestjs/swagger';
import { ChannelEntity } from './channel.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'channel_member' })
export class MemberEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => ChannelEntity })
  @ManyToOne(() => ChannelEntity, (channel) => channel.members, {
    onDelete: 'CASCADE',
  })
  channel: ChannelEntity;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.memberships, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ApiProperty()
  @Column({ default: false })
  is_admin: boolean;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn()
  updatedAt: Date;
}
