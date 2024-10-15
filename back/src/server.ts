// src/server.ts
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import userRouter from './routes/userRouter';
import appointmentRouter from './routes/appointmentRouter';
import emailRouter from './routes/emailRouter';
import dotenv from 'dotenv';

dotenv.config();

const server = express();

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'https://synergy2-devs.vercel.app',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: true,
};

server.use(cors(corsOptions));
server.use(morgan('dev'));
server.use(express.json());

const sessionSecret = process.env.SESSION_SECRET || 'your_secret_key';

server.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  }),
);

server.use('/users', userRouter);
server.use('/appointments', appointmentRouter);
server.use('/emails', emailRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
