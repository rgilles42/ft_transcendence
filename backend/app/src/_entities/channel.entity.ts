import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RestrictionEntity as RestrictionEntity } from './channel-restriction.entity';
import { MessageEntity } from './channel-message.entity';
import { MemberEntity } from './channel-member.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'channel' })
export class ChannelEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  isPrivate: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  password: string;

  @ApiProperty()
  @Column({ nullable: false })
  ownerId: number;
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;

  @ApiProperty({ type: () => [MemberEntity] })
  @OneToMany(() => MemberEntity, (member) => member.channel, { eager: true })
  members: MemberEntity[];

  @ApiProperty({ type: () => [RestrictionEntity] })
  @OneToMany(() => RestrictionEntity, (restrictions) => restrictions.channel)
  restrictions: RestrictionEntity[];

  @ApiProperty({ type: () => [MessageEntity] })
  @OneToMany(() => MessageEntity, (message) => message.channel)
  messages: MessageEntity[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
