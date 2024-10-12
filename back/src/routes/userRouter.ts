import { Router } from 'express';
import autenticacion from '../middlewares/autenticacion';
import {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  deleteUser,
} from '../controllers/usersControllers';

const router: Router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/', autenticacion, getUsers);
router.get('/:id', getUserById);

router.delete('/:id', deleteUser);

export default router;

// GET /user => Obtener todos los usuarios
// GET /user/:id => Obtener un usuario por su id

// POST /user/register => Crear un nuevo usuario
// POST /users/login => Login del usuario a la aplicación
