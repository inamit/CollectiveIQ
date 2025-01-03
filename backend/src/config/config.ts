import dotenv from 'dotenv';
dotenv.config();

export const GlobalConfig = {
  PORT: process.env.PORT,
  MONGO_CONNECTION: process.env.MONGO_CONNECTION,
  APARTMENT_DB: process.env.APARTMENT_DB
};