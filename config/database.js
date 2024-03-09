// C O N N E C T   W I T H   M O N G O O S E  D B
import mongoose from "mongoose";

// I M P O R T:  E N V
import { MONGO_DB_CONNECTION_STRING } from "./config.js";

// ==============================================================

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_DB_CONNECTION_STRING);
    console.log("Connect with MongoDB: SUCCESS  ✅");
  } catch (err) {
    console.log("Connect with MongoDB: FAILED ⛔", err);
  }

  mongoose.connection.on("error", (err) => {
    console.error("Error connecting to the database:", err);
  });
};
