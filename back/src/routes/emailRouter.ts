import { Router } from 'express';
import { sendEmail } from '../controllers/emailControllers';

const router: Router = Router();

router.post('/send', sendEmail);

export default router;
