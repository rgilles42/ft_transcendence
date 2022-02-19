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
import { ChannelRestrictionEntity } from './channel-restriction.entity';
import { ChannelMessageEntity } from './channel-message.entity';

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

  @ApiProperty({ type: () => [ChannelRestrictionEntity] })
  @OneToMany(
    () => ChannelRestrictionEntity,
    (restrictions) => restrictions.channel,
  )
  restrictions: ChannelRestrictionEntity[];

  @ApiProperty({ type: () => [ChannelMessageEntity] })
  @OneToMany(() => ChannelMessageEntity, (message) => message.channel)
  messages: ChannelMessageEntity[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
