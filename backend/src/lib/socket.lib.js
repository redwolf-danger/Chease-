import { Server } from "socket.io"
import http from "http";
import express from "express"

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

//USED TO STORE ONLINE USERS
const userSocketMap = {};
// userId: socketId

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // todo devise a mechanism so that i don't have to emit the whole map everytime a user gets online
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    // console.log("A user connected", socket.id);
    socket.on("disconnect", () => {
        // console.log("A user disconnected ", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}
export { io, app, server }