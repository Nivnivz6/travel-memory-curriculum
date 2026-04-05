import mongoose from "mongoose";
import "dotenv/config";

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

const connectDB = async () => {
  const url = process.env.MONGO_URI;
  try {
    await mongoose.connect(url);
    console.log("connected db");
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

export { connectDB };
