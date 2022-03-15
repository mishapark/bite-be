require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('database connected');
  } catch (error) {
    console.log('unable to connect' + error.message);
  }
};

module.exports = connectDB;
