import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';

@Entity({ name: 'channel_message' })
export class MessageEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => ChannelEntity })
  @ManyToOne(() => ChannelEntity, (channel) => channel.messages, {
    onDelete: 'CASCADE',
  })
  channel: ChannelEntity;

  @ApiProperty({ type: () => UserEntity })
  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ApiProperty()
  @Column()
  message: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn()
  updatedAt: Date;
}
