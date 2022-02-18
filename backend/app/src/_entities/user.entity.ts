import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BlockshipEntity } from './blockship.entity';
import { FriendshipEntity } from './friendship.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  login: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty()
  @Column({ nullable: true })
  status: string;

  //@ApiProperty({ type: () => [FriendshipEntity] })
  @OneToMany(() => FriendshipEntity, (friendship) => friendship.user)
  friends: FriendshipEntity[];

  //@ApiProperty({ type: () => [BlockshipEntity] })
  @OneToMany(() => BlockshipEntity, (blockship) => blockship.user)
  blocked_users: BlockshipEntity[];

  // @ApiProperty()
  // @Column()
  // 2fa: ???;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
