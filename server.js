// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
// import * as dotenv from "dotenv";
// dotenv.config();
// import mongoose from "mongoose";
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// I M P O R T:  E N V  O P T I O N S
import { PORT, corsOptions } from "./config/config.js";

// I M P O R T:  C O M P O N E N T S
import { connectToDatabase } from "./config/database.js";

// I M P O R T:  M I D D L E W A R E  H A N D L E R
import invalidRoute from "./routes/invalidRoute.js";
import errorHandler from "./middleware/errorhandler.js";

// I M P O R T:  R O U T E S
import searchRouter from "./routes/searches.js";
import userRouter from "./routes/users.js";
import projectRouter from "./routes/projects.js";
import notificationRouter from "./routes/notifications.js";
import messageRouter from "./routes/messages.js";
import conversationRouter from "./routes/conversations.js";
import stoneRouter from "./routes/stones.js";
import counterRouter from "./routes/counters.js";

// ==============================================================

// C R E A T E  S E R V E R
const app = express();
app.use(express.static("public"));

// M I D D L E W A R E

// SERVER MIDDLEWARE
// app.use(express.json());
// app.use(cookieParser());
// // app.use(cors()) auskommentieren für IONOS
// app.use(
//   cors({
//     origin: [
//       "https://improof.onrender.com",
//       "http://127.0.0.1:5173",
//       "http://localhost:5173",
//       "https://improof-fe.vercel.app",
//     ],
//     credentials: true,
//   })
// );
// app.use(morgan("dev"));

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors()) auskommentieren für IONOS
app.use(cors(corsOptions));

// ROUTER MIDDLEWARE

// Ignore-favicon-handler => delete it in case of existing frontend
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // 204 No Content
});

// COUNTER
app.use("/api/counters", counterRouter);

// USERS
app.use("/api/users", userRouter);

// SEARCH
app.use("/api/search", searchRouter);

// PROJECT
app.use("/api/projects", projectRouter);

// NOTIFICATIONS
app.use("/api/notifications", notificationRouter);

// CONVERSATIONS
app.use("/api/conversations", conversationRouter);

// MESSAGES
app.use("/api/messages", messageRouter);

// STONES
app.use("/api/stones", stoneRouter);

// PROJECTS
app.use("/api/projects", projectRouter);

// WRONG PATH HANDLER
app.use("*", invalidRoute);

// ERROR HANDLER
app.use(errorHandler);

// ==============================================================

// C O N N E C T   W I T H   M O N G O O S E  D B
connectToDatabase();

// S E R V E R - S T A R T
app.listen(PORT, () => {
  console.log("Server runs on Port: " + PORT, "🔄");
});
