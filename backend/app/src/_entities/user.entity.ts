import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MemberEntity } from './channel-member.entity';
import { ChannelEntity } from './channel.entity';
import { GameEntity } from './game.entity';
import { BlockshipEntity } from './users_blockship.entity';
import { FriendshipEntity } from './users_friendship.entity';

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
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty()
  @Column({ default: 0 })
  status: number;

  @ApiProperty()
  @Column({ nullable: true })
  activity: string;

  //@ApiProperty({ type: () => [FriendshipEntity] })
  @OneToMany(() => FriendshipEntity, (friendship) => friendship.user)
  friends: FriendshipEntity[];

  //@ApiProperty({ type: () => [BlockshipEntity] })
  @OneToMany(() => BlockshipEntity, (blockship) => blockship.user)
  blockedUsers: BlockshipEntity[];

  //@ApiProperty({ type: () => [MemberEntity] })
  @OneToMany(() => MemberEntity, (membership) => membership.user)
  memberships: MemberEntity[];

  channels: ChannelEntity[];
  games: GameEntity[];

  @Column({ nullable: true })
  twoFactorAuthSecret?: string;

  @Column({ default: false })
  public isTwoFactorEnable: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
