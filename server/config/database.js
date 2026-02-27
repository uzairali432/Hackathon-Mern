import mongoose from 'mongoose';
import { config } from './environment.js';

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database] Connection failed: ${error.message}`);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('[Database] Disconnected');
  } catch (error) {
    console.error(`[Database] Disconnection failed: ${error.message}`);
    throw error;
  }
};
