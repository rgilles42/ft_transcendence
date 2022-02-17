import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_blockships' })
export class BlockshipEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  blockship_id: number;

  @ManyToOne(() => UserEntity, (user) => user.friends, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn()
  blocked_user: UserEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
