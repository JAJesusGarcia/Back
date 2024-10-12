import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'credentials' })
export class Credential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 20 })
  password: string;

  @OneToOne(() => User, (user) => user.credentials, {
    onDelete: 'CASCADE',
  })
  user: User;
}
