import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum friendshipStatus {
  PENDING = 0,
  ACCEPTED = 1,
}

@Entity({ name: 'user_friendships' })
export class FriendshipEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.friends, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty()
  @Column({ nullable: false })
  friendId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'friendId' })
  friend: UserEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ enum: friendshipStatus })
  @Column({
    type: 'enum',
    enum: friendshipStatus,
    default: friendshipStatus.PENDING,
  })
  status: friendshipStatus;
}
