import { ApiProperty } from '@nestjs/swagger';
import { ChannelEntity } from './channel.entity';
import { UserEntity } from './user.entity';
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

export enum restrictionType {
  MUTE = 0,
  BAN = 1,
}

@Entity({ name: 'channel_restriction' })
export class RestrictionEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => ChannelEntity })
  @ManyToOne(() => ChannelEntity, (channel) => channel.restrictions, {
    onDelete: 'CASCADE',
  })
  channel: ChannelEntity;

  @ApiProperty({ type: () => UserEntity })
  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ApiProperty({ enum: restrictionType })
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
