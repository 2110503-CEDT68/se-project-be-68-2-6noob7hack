// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return; // 1=connected, 2=connecting

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    bufferCommands: false,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;