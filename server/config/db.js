import mongoose from "mongoose";

const connectDB = async () => {
  // FIX: Guard against undefined URI with a clear error message
  // FIX: Use MONGO_URI to match the .env variable name
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is not defined in your .env file.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;