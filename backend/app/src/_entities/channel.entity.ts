import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RestrictionEntity as RestrictionEntity } from './channel-restriction.entity';
import { MessageEntity } from './channel-message.entity';

@Entity({ name: 'channel' })
export class ChannelEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  type: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  password: string;

  @ApiProperty()
  @ManyToOne(() => UserEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinTable()
  owner: UserEntity;

  @ApiProperty({ type: () => [UserEntity] })
  @ManyToMany(() => UserEntity, { eager: true })
  @JoinTable()
  members: UserEntity[];

  @ApiProperty({ type: () => [UserEntity] })
  @ManyToMany(() => UserEntity, { eager: true })
  @JoinTable()
  admins: UserEntity[];

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
