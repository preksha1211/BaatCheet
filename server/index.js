import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "*", // baad me frontend URL laga sakti ho
    methods: ["GET", "POST"]
  }
});

let users = [];

const addUser = (userData, socketId) => {
  const isExist = users.find(user => user.sub === userData.sub);
  if (!isExist && userData) {
    users.push({ ...userData, socketId });
  }
};

const getUser = (userId) => {
  return users.find(user => user.sub === userId);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("addUser", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    users = users.filter(user => user.socketId !== socket.id);
    io.emit("getUsers", users);
    console.log("User disconnected:", socket.id);
  });
});

// ================= REACT BUILD SERVE =================
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
