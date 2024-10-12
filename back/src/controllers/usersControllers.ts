import { Request, Response } from 'express';
import {
  createUserServices,
  getUserServices,
  deleteUserServices,
  findUserById,
  findUserWithTurns,
} from '../services/usersServices';
import { validateCredential } from '../services/credentialsServices';
import UserDto from '../dto/UserDto';

function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }
  return date.toISOString().split('T')[0];
}

export const getUsers = async (req: Request, res: Response) => {
  const users = await getUserServices();
  res.status(200).json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await findUserWithTurns(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  console.log('Received registration data:', req.body);
  try {
    const userData: UserDto = {
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      birthdate: req.body.birthdate,
      nDni: req.body.nDni,
      numberPhone: req.body.numberPhone,
      credentialsId: {
        username: req.body.credentialsId.username,
        password: req.body.credentialsId.password,
      },
    };
    console.log('Processed userData:', userData);
    const newUser = await createUserServices(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error en el registro:', error);
    if (error instanceof Error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        res.status(400).json({ message: 'Username or email already exists' });
      } else {
        res
          .status(500)
          .json({ message: `Error creating user: ${error.message}` });
      }
    } else {
      res.status(500).json({ message: 'Error creating user: Unknown error' });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('Attempting login for user:', username);
    const user = await validateCredential({ username, password });
    if (user) {
      console.log('Login successful for user:', username);
      res.status(200).json({
        login: true,
        user: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          numberPhone: user.numberPhone,
          birthdate: formatDate(user.birthDate),
          nDni: user.nDni.toString(), // Asegúrate de que esto sea una cadena
        },
      });
    } else {
      console.log('Login failed: Invalid credentials for user:', username);
      res.status(400).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteUserServices(id);
    res.status(200).json({ message: 'Eliminado correctamente' });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes('Usuario no encontrado')
    ) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
