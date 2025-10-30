const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("new-user-joined", (name) => {
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send-message", (data) => {
    socket.broadcast.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
