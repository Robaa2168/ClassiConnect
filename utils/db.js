// db.js
import mongoose from 'mongoose';

const connection = { isConnected: false };

/**
 * Establishes a connection to the MongoDB database.
 * If a connection already exists, the existing connection is used.
 * Otherwise, a new connection is established.
 */
export async function connectDb() {
  if (connection.isConnected) {
    console.log("Using existing connection");
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
  }
}

export default connectDb;
