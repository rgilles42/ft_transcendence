import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum gameType {
  NORMAL = 0,
  ENHANCED = 1,
}

@Entity({ name: 'games' })
export class GameEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: gameType })
  @Column({
    type: 'enum',
    enum: gameType,
  })
  type: gameType;

  @ApiProperty()
  @Column({ nullable: false })
  player1Id: number;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'player1Id' })
  player1: UserEntity;

  @ApiProperty()
  @Column()
  player1Score: number;

  @ApiProperty()
  @Column({ nullable: false })
  player2Id: number;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'player2Id' })
  player2: UserEntity;

  @ApiProperty()
  @Column()
  player2Score: number;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @Column()
  endAt: Date;
}
