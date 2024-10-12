import { AppDataSource, UserModel } from '../config/data-source';
import UserDto from '../dto/UserDto';
import { User } from '../entities/User';
import { Appointment } from '../entities/Appointment';
import { Credential } from '../entities/Credential';
import { createCredential } from './credentialsServices';

export const createUserServices = async (userData: UserDto): Promise<User> => {
  console.log('Starting user creation process');
  console.log('Received userData:', userData);
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('Creating credential');
    const newCredential = await createCredential(
      userData.credentialsId.username,
      userData.credentialsId.password,
    );
    console.log('Credential created successfully');

    console.log('Creating user');
    const newUser = new User();
    newUser.name = userData.name;
    newUser.lastName = userData.lastName;
    newUser.email = userData.email;

    // Convertir birthDate a objeto Date
    newUser.birthDate = new Date(userData.birthdate);

    if (isNaN(newUser.birthDate.getTime())) {
      throw new Error('Invalid birthDate format');
    }

    newUser.nDni = userData.nDni;
    newUser.numberPhone = userData.numberPhone;
    newUser.active = true;
    newUser.credentials = newCredential;

    console.log('Saving user to database');
    await queryRunner.manager.save(User, newUser);
    console.log('User saved successfully');

    await queryRunner.commitTransaction();
    console.log('Transaction committed');

    return newUser;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Detailed error in createUserServices:', error);
    throw new Error(
      `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  } finally {
    await queryRunner.release();
  }
};

export const getUserServices = async (): Promise<User[]> => {
  return await UserModel.find({
    relations: ['credentials'],
  });
};

export const deleteUserServices = async (id: string): Promise<void> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('Buscando usuario con ID:', id);
    const user = await UserModel.findOne({
      where: { id: Number(id) },
      relations: ['appointments', 'credentials'],
    });

    console.log('Usuario encontrado:', user);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Eliminar las citas asociadas
    if (user.appointments.length > 0) {
      await Promise.all(
        user.appointments.map((appointment) =>
          queryRunner.manager.remove(Appointment, appointment),
        ),
      );
    }

    // Eliminar las credenciales asociadas
    if (user.credentials) {
      await queryRunner.manager.remove(Credential, user.credentials);
    }

    // Eliminar el usuario
    await queryRunner.manager.remove(User, user);

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Detailed error in deleteUserServices:', error);
    throw new Error(
      `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  } finally {
    await queryRunner.release();
  }
};

export const findUserById = async (userId: string): Promise<User | null> => {
  return await UserModel.findOne({
    where: { id: Number(userId) },
    relations: ['credentials'],
  });
};

export const findUserWithTurns = async (
  userId: string,
): Promise<User | null> => {
  return await UserModel.findOne({
    where: { id: Number(userId) },
    relations: ['appointments'],
  });
};
