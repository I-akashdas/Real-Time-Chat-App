
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const users = {};

io.on("connection", (socket) => {
  console.log("🔗 New user connected:", socket.id);

  socket.on("new-user-joined", (username) => {
    users[socket.id] = username;

   
    socket.broadcast.emit("user-joined", username);

    console.log(`🟢 ${username} joined the chat`);
  });

  
  socket.on("send-message", (msg) => {
    const time = new Date().toLocaleTimeString();

    const data = {
      user: users[socket.id],
      message: msg,
      time: time,
    };

    socket.broadcast.emit("receive-message", data);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("user-typing", users[socket.id]);
  });

  socket.on("stop-typing", () => {
    socket.broadcast.emit("user-stop-typing");
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];

    if (username) {
      socket.broadcast.emit("user-left", username);
      console.log(`🔴 ${username} disconnected`);
      delete users[socket.id];
    }
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
