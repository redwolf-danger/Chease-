import express from 'express';
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
import { connectDB } from './lib/db.lib.js';
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.lib.js"
import path from "path";
import { FireApp } from "./lib/db/FireBase.db.lib.js";

if (!FireApp) {
    console.log("FireBase is running .... ");
}


const __dirname = path.resolve();



dotenv.config(); //to add dotenv inside the process space
const port = process.env.PORT
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
};


server.listen(port, () => {
    console.log("server is running");
    connectDB()
})