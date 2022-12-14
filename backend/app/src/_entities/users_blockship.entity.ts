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

@Entity({ name: 'user_blockships' })
export class BlockshipEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  userId: number;
  @ManyToOne(() => UserEntity, (user) => user.blockedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty()
  @Column({ nullable: false })
  blockedId: number;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockedId' })
  blockedUser: UserEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
