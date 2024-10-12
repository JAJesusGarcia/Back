// src/controllers/appointmentControllers.ts
import { Request, Response } from 'express';
import {
  createAppointmentService,
  getAppointmentsService,
  cancelAppointmentService,
  getAppointmentById,
  deleteAppointmentService,
} from '../services/appointmentServices';
import AppointmentDto from '../dto/AppointmentDto';

export const getAppointments = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const appointments = await getAppointmentsService(
      userId ? Number(userId) : undefined,
    );
    res.status(200).json(appointments); // Siempre devuelve 200
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const appointment = await getAppointmentById(parseInt(id));
    if (appointment) {
      res.status(200).json(appointment);
    } else {
      res.status(404).json({ message: 'Turno no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const scheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { date, time, description, userId } = req.body;

    if (!date || !time || !userId) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const newAppointment = await createAppointmentService({
      date,
      time,
      description,
      userId,
    });
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error al programar cita:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cancelled = await cancelAppointmentService(parseInt(id));
    if (cancelled) {
      res.status(200).json({ message: 'Turno cancelado correctamente' });
    } else {
      res.status(404).json({ message: 'Turno no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await deleteAppointmentService(parseInt(id));
  if (deleted) {
    res.status(200).json({ message: 'Turno eliminado correctamente' });
  } else {
    res.status(404).json({ message: 'Turno no encontrado' });
  }
};
