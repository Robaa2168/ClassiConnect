// db.js


/**
 * Establishes a connection to the MongoDB database.
 * If a connection already exists, the existing connection is used.
 * Otherwise, a new connection is established.
 */
import mongoose from 'mongoose';

const connection = {};

export async function connectDb() {
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }

  if (mongoose.connections[0].readyState) {
    connection.isConnected = true;
    console.log("Using mongoose existing connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    });
    console.log("DB Connected");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error('Connection error:', error);
    throw new Error('Failed to connect to DB');
  }
}

export default connectDb;
