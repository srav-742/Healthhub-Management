// ✅ config/db.js — FIXED TO USE ATLAS
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ✅ Use MONGO_URI from .env, NOT hardcoded localhost
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser & useUnifiedTopology are DEFAULT in Mongoose 6+ → omit them
    });

    const db = mongoose.connection;
    await db.db.collection('users').findOne({}, { projection: { _id: 1 } });
    console.log(`✅ MongoDB Connected: ${db.host}`);
    console.log(`📁 Database: ${db.name}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('🔧 Check MONGO_URI in .env — is IP whitelisted in Atlas?');
    if (err.code === 8000) {
      console.error('MongoDB Atlas permission error: grant the database user readWrite access to the healthhub database.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
