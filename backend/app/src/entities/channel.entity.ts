import { ApiProperty } from '@nestjs/swagger';
import { ChannelMemberEntity } from './channel-member.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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
  @Column()
  owner: number;

  @ApiProperty()
  @OneToMany(() => ChannelMemberEntity, member => member.channel)
  members: ChannelMemberEntity[];

  //	@ApiProperty()
  //	@Column()
  //	restricted: array[channels_restrictions];

  //	@ApiProperty()
  //	@Column()
  //	messages: array[channels_messages];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
