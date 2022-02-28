import { ApiProperty } from '@nestjs/swagger';
import { ChannelEntity } from './channel.entity';
import { UserEntity } from './user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @ApiProperty()
  @Column({ nullable: false })
  channelId: number;
  @ManyToOne(() => ChannelEntity, (channel) => channel.restrictions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'channelId' })
  channel: ChannelEntity;

  @ApiProperty()
  @Column({ nullable: false })
  userId: number;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({ enum: restrictionType })
  @Column({
    type: 'enum',
    enum: restrictionType,
  })
  type: restrictionType;

  @ApiProperty()
  @Column({ nullable: true })
  endAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn()
  updatedAt: Date;
}
