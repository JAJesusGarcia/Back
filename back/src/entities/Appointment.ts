import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

export enum Status {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column({ length: 100 })
  description: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.appointments)
  user: User;

  @Column()
  userId: number;
}
