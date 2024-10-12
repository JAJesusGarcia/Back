import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from './Appointment';
import { Credential } from './Credential';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 90 })
  email: string;

  @Column()
  active: boolean;

  @Column()
  birthDate: Date;

  @Column({ type: 'bigint' })
  nDni: number;

  @Column({ length: 20 })
  numberPhone: string;

  @OneToOne(() => Credential, (credential) => credential.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  credentials: Credential;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];
}
