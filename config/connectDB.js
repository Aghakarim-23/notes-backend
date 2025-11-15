import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB is connected successfully".bgGreen);
  } catch (error) {
    console.log("Mongo DB is not connected", error);
    process.exit(1);
  }
};

export default connectDB;
