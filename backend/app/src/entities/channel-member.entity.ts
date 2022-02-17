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

@Entity({ name: 'channel_member' })
export class ChannelMemberEntity {
    @ApiProperty()
	@PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
	@ManyToOne(() => ChannelEntity, channel => channel.members, {onDelete: 'CASCADE'})
    channel: ChannelEntity;

	@ApiProperty()
	@Column()
	isAdmin: boolean;

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date;
  
	@ApiProperty()
	@UpdateDateColumn()
	updatedAt: Date;
}