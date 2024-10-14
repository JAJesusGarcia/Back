// src/server.ts
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import userRouter from './routes/userRouter';
import appointmentRouter from './routes/appointmentRouter';
import emailRouter from './routes/emailRouter';
import dotenv from 'dotenv';

const server = express();
dotenv.config();

const corsOptions = {
  origin: ['https://synergy2-devs.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'], // Añade el encabezado 'Authorization' o 'token'
  credentials: true,
};

server.use(cors(corsOptions));
server.use(morgan('dev'));
server.use(express.json());

// Configuración de la sesión
server.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Cambiar a true si usas HTTPS en producción
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // none para cross-site
      httpOnly: true, // Las cookies solo son accesibles en el servidor
    },
  }),
);

server.use('/users', userRouter);
server.use('/appointments', appointmentRouter);
server.use('/emails', emailRouter);

export default server;
