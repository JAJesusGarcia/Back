import {
  AppDataSource,
  UserModel,
  AppointmentModel,
  CredentialModel,
} from '../config/data-source';
import { Appointment, Status } from '../entities/Appointment';
import { User } from '../entities/User';

const preloadUsers = [
  {
    name: 'Persona',
    lastName: 'Prueba',
    email: 'persona@example.com',
    birthDate: '1999-09-19',
    nDni: 41123123,
    numberPhone: 123456789,
    active: true,
    credentials: {
      username: 'persona123',
      password: 'Persona.123',
    },
  },
];

const preloadAppointments = [
  {
    date: '2024-08-02',
    time: '13:00',
    description: 'Desarrollo de Sitios Web',
    status: Status.ACTIVE,
  },
];

export const preloadUserData = async () => {
  if (!preloadUsers || !preloadUsers.length) {
    console.log('No hay datos de usuarios para precargar');
    return;
  }

  await AppDataSource.manager.transaction(
    async (transactionalEntityManager) => {
      const existingUsers = await UserModel.find();
      if (existingUsers.length) {
        console.log('No se hizo la precarga de datos porque ya existen datos');
        return;
      }

      for (const user of preloadUsers) {
        // Crear credenciales
        const newCredential = CredentialModel.create({
          ...user.credentials,
        });
        await transactionalEntityManager.save(newCredential);

        // Crear usuario
        const newUser = UserModel.create({
          ...user,
          birthDate: new Date(user.birthDate),
          numberPhone: user.numberPhone.toString(),
          credentials: newCredential,
        });

        await transactionalEntityManager.save(newUser);
      }

      console.log('Precarga de datos realizada con éxito');
    },
  );
};

export const preloadAppointmentsData = async () => {
  // Limpiar citas existentes antes de agregar nuevas (opcional)
  // await AppDataSource.getRepository(Appointment).clear();
  const existinAppointments = await AppointmentModel.count();
  if (existinAppointments > 0) {
    console.log('Ya existen turnos. No se realizará la precarga');
    return;
  }

  await AppDataSource.manager.transaction(
    async (transactionalEntityManager) => {
      // Obtener todos los usuarios para asignar citas
      const users = await transactionalEntityManager.find(User);
      if (users.length === 0) {
        console.warn('No se encontraron usuarios. No se pueden crear citas.');
        return;
      }

      // Insertar citas predefinidas
      for (const appointmentData of preloadAppointments) {
        // Convertir la fecha y hora a un objeto Date
        const dateObject = new Date(
          `${appointmentData.date}T${appointmentData.time}`,
        );

        // Elegir un usuario al azar para asignar la cita (puedes ajustar esta lógica)
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // Crear una nueva cita
        const newAppointment = AppointmentModel.create({
          date: dateObject,
          time: appointmentData.time,
          description: appointmentData.description,
          status: appointmentData.status, // Asegúrate de que esto sea del tipo Status
          user: randomUser,
        });

        await transactionalEntityManager.save(newAppointment);
      }

      console.log('Precarga de datos de citas realizada con éxito');
    },
  );
};
// const newUser1 = await UserModel.create(user1);
// const newUser2 = await UserModel.create(user2);
// const newUser3 = await UserModel.create(user3);
// const newUser4 = await UserModel.create(user4);

// await transactionalEntityManeger.save(newUser1);
// await transactionalEntityManeger.save(newUser2);
// await transactionalEntityManeger.save(newUser3);
// await transactionalEntityManeger.save(newUser4);
