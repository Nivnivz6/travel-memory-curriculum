import mongoose from "mongoose";
import "dotenv/config";

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

const connectDB = async () => {
  const url = process.env.MONGO_URI;

  const connect = mongoose.connection;

  connect.on("connected", () => {
    console.log("MongoDB Connection Established");
  });

  connect.on("reconnected", () => {
    console.log("MongoDB Connection Reestablished");
  });

  connect.on("disconnected", () => {
    console.log("MongoDB Connection Disconnected");
    console.log("Trying to reconnect to Mongo...");

    setTimeout(() => {
      mongoose.connect(url).catch(err => console.log("Reconnect failed:", err));
    }, 3000);
  });

  connect.on("close", () => {
    console.log("Mongo Connection Closed");
  });

  connect.on("error", (error) => {
    console.log("Mongo Connection Error:", error);
  });

  try {
    await mongoose.connect(url);
  } catch (error) {
    console.log(error);
  }
};

export { connectDB };