import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Appointment } from '../entities/Appointment';
import { Credential } from '../entities/Credential';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'my_database', // Asegúrate de tener tu base de datos creada
  dropSchema: false,
  synchronize: true,
  logging: false,
  entities: [User, Appointment, Credential],
  subscribers: [],
  migrations: [],
});

export const UserModel = AppDataSource.getRepository(User);
export const AppointmentModel = AppDataSource.getRepository(Appointment);
export const CredentialModel = AppDataSource.getRepository(Credential);

// 'Src/**/*.entity{.ts,.js}';
