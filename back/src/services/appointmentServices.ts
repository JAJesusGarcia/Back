import {
  AppDataSource,
  AppointmentModel,
  UserModel,
} from '../config/data-source';
import { Appointment, Status } from '../entities/Appointment';
import AppointmentDto from '../dto/AppointmentDto';
import { User } from '../entities/User';
import { Equal } from 'typeorm';

// const appointmentRepository = AppDataSource.getRepository(Appointment);
// const userRepository = AppDataSource.getRepository(User);

export const getAppointmentsService = async (
  userId?: number,
): Promise<Appointment[]> => {
  if (userId) {
    return await AppointmentModel.find({
      where: { userId: Equal(userId) },
      relations: ['user'],
    });
  }
  return await AppointmentModel.find({ relations: ['user'] });
};

export const getAppointmentById = async (
  id: number,
): Promise<Appointment | null> => {
  return await AppointmentModel.findOne({
    where: { id },
    relations: ['user'],
  });
};

const convertToStatus = (status: string): Status => {
  switch (status.toLowerCase()) {
    case 'active':
      return Status.ACTIVE;
    case 'cancelled':
      return Status.CANCELLED;
    default:
      throw new Error(`Invalid status: ${status}`);
  }
};

export const createAppointmentService = async (
  appointmentData: AppointmentDto,
): Promise<Appointment> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userId = Number(appointmentData.userId);
    if (isNaN(userId)) {
      throw new Error('ID de usuario inválido');
    }

    const user = await queryRunner.manager.findOne(User, {
      where: { id: userId },
    });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si ya existe un appointment para este usuario en la misma fecha y hora
    const existingAppointment = await queryRunner.manager.findOne(Appointment, {
      where: {
        user: { id: userId },
        date: appointmentData.date,
        time: appointmentData.time,
        status: Status.ACTIVE,
      },
    });

    if (existingAppointment) {
      throw new Error(
        'Ya existe un turno activo para este usuario en la fecha y hora especificadas',
      );
    }

    // Validar que la fecha y hora son futuras
    const appointmentDateTime = new Date(
      `${appointmentData.date}T${appointmentData.time}`,
    );
    if (appointmentDateTime <= new Date()) {
      throw new Error('La fecha y hora del turno deben ser futuras');
    }

    const newAppointment = AppointmentModel.create({
      date: appointmentData.date,
      time: appointmentData.time,
      description: appointmentData.description,
      user: user,
      status: Status.ACTIVE,
    });

    await queryRunner.manager.save(newAppointment);
    await queryRunner.commitTransaction();

    return newAppointment;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const cancelAppointmentService = async (
  id: number,
): Promise<boolean> => {
  const appointment = await AppointmentModel.findOneBy({ id });
  if (appointment) {
    appointment.status = Status.CANCELLED;
    await AppointmentModel.save(appointment);
    return true;
  }
  return false;
};

export const deleteAppointmentService = async (
  id: number,
): Promise<boolean> => {
  const result = await AppointmentModel.delete(id);
  return result.affected !== 0;
};
