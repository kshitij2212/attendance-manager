import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/mongo';
import app from './app';

const PORT = process.env.PORT || 8000;

const start = async () => {
  const connected = await connectDB(process.env.MONGO_URI);
  if (!connected) {
    console.warn('Warning: MongoDB not connected. Starting server in degraded mode.');
  }
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
};

start();
