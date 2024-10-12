// src/routes/appointmentRoutes.ts
import { Router } from 'express';
import {
  getAppointments,
  getAppointment,
  scheduleAppointment,
  cancelAppointment,
  deleteAppointment,
} from '../controllers/appointmentControllers';

const router: Router = Router();

router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.post('/', scheduleAppointment);
router.put('/cancel/:id', cancelAppointment);
router.delete('/:id', deleteAppointment);

export default router;
