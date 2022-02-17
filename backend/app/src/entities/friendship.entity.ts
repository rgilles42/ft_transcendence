import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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
  friendship_id: number;

  @ManyToOne(() => UserEntity, (user) => user.friends, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn()
  friend: UserEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: friendshipStatus,
    default: friendshipStatus.PENDING,
  })
  status: friendshipStatus;
}
