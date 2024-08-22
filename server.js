import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import db_connect from "./utils/db.js";

import { app, server } from "./socket/socket.js";

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRouter);

app.use("*", (req, res) => {
  res.send("Route not found");
});

const PORT = process.env.PORT || 6000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  db_connect();
});
