import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  login: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
