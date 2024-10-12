import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Appointment } from '../entities/Appointment';
import { Credential } from '../entities/Credential';
import { DATABASE_URL } from './envs';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL, // Usamos la URL completa
  synchronize: true, // Sincroniza las entidades con la base de datos
  logging: false,
  ssl: {
    rejectUnauthorized: false, // Para evitar problemas de SSL en producción
  },
  entities: [User, Appointment, Credential],
  subscribers: [],
  migrations: [],
});

export const UserModel = AppDataSource.getRepository(User);
export const AppointmentModel = AppDataSource.getRepository(Appointment);
export const CredentialModel = AppDataSource.getRepository(Credential);

// 'Src/**/*.entity{.ts,.js}';
