import { Router } from 'express';
import userRoutes from './userRouter';
import appointmentRoutes from './appointmentRouter';
import autenticacion from '../middlewares/autenticacion';
import emailRouter from './emailRouter';

const router: Router = Router();

router.use('/users', autenticacion, userRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/emails', emailRouter);

export default router;
