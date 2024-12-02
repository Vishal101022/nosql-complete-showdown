const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running."
    );
    console.log(error);
  }
}

module.exports = connectDB;
