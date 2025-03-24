import { Server } from "socket.io"
import http from "http";
import express from "express"

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

//USED TO STORE ONLINE USERS
const userSocketMap = {};
// handle: socketId



io.on("connection", (socket) => {
    console.log("a user connected");
    const user = socket.handshake.query.user;
    const { handle } = user;

    //todo: if time design a filter based on user settings
    const onlineVisible = true;
    if (handle && onlineVisible) {
        userSocketMap[handle] = socket.id;
    }

    // todo devise a mechanism so that i don't have to emit the whole map everytime a user gets online
    //-- we just emit +handle and -handle each time
    //user
    console.log("emittin for getOnlineUsers");
    io.emit("getOnlineUsers",
        // `+${handle}`
        {
            add: true,
            delete: false,
            user: user
        }
        // Object.keys(userSocketMap)
    )

    // console.log("A user connected", socket.id);
    socket.on("disconnect", () => {
        // console.log("A user disconnected ", socket.id);
        delete userSocketMap[handle];
        console.log("a user disconnected");
        io.emit("getOnlineUsers", {
            add: false,
            delete: true,
            user: user
        });
    })
})

export function getReceiverSocketId(handle) {
    return userSocketMap[handle];
}
// export { io, app, server }