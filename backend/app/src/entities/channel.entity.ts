import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
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
	owner: number;

	@ApiProperty()
	@Column( { nullable: true })
	password: string;

	@ApiProperty()
	@Column()
	type: boolean;

//	@ApiProperty()
//	@Column()
//	members: array[channels_members];

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