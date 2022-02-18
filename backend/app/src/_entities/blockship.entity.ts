import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_blockships' })
export class BlockshipEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  blockship_id: number;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.blocked_users, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true, onDelete: 'CASCADE' })
  blocked_user: UserEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
