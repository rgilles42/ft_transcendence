import { ApiProperty } from '@nestjs/swagger';
import { ChannelEntity } from './channel.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum restrictionType {
  MUTE = 0,
  BAN = 1,
  ALL = 2,
}

@Entity({ name: 'channel_restriction' })
export class ChannelRestrictionEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => ChannelEntity })
  @ManyToOne(() => ChannelEntity, (channel) => channel.restrictions, {
    onDelete: 'CASCADE',
  })
  channel: ChannelEntity;

  @ApiProperty({ type: () => UserEntity })
  @OneToOne(() => UserEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: restrictionType,
  })
  type: restrictionType;

  @ApiProperty()
  @Column()
  endAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn()
  updatedAt: Date;
}
