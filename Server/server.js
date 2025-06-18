// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace * with your frontend domain
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () =>
  console.log("Server running on http://localhost:4000")
);
