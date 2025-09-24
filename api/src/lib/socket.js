import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   },
//   pingTimeout: 60000, // Increase timeout for better stability
// });
const io=  new Server(server, {
     cors:{origin: "*"}
})
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle typing events
  socket.on("typing", (data) => {
    if (data && data.toUserId) {
      const receiverSocketId = getReceiverSocketId(data.toUserId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", userId);
      }
    }
  });

  // Handle last seen updates
  socket.on("updateLastSeen", (userId) => {
    if (userId) {
      io.emit("lastSeenUpdate", {
        userId,
        lastSeen: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Find and remove the userId from userSocketMap
    const userIdToRemove = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );

    if (userIdToRemove) {
      delete userSocketMap[userIdToRemove];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };