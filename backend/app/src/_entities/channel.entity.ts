import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ChannelRestrictionEntity } from './channel-restriction.entity';
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

  //    @ApiProperty()
  //    @Column()
  //    messages: array[channels_messages];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
