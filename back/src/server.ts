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
  origin: [
    'https://synergy2-devs.vercel.app/home', // Asegúrate de que coincida exactamente con el origen del frontend
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Si estás enviando cookies o encabezados de autorización
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
    cookie: { secure: false }, // Cambia a true en producción si usas HTTPS
  }),
);

server.use('/users', userRouter);
server.use('/appointments', appointmentRouter);
server.use('/emails', emailRouter);

export default server;
