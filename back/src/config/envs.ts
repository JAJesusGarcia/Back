import dotenv from 'dotenv';
dotenv.config();

export const PORT: number = Number(process.env.PORT) || 3000;
export const DATABASE_URL: string = process.env.DATABASE_URL || '';
