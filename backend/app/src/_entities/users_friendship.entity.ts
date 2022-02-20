import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
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
  friendship_id: number;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.friends, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true, onDelete: 'CASCADE' })
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
