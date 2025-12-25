import { Server } from "socket.io";

const io = new Server(9000, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

let users = [];

// Add user if not exist
const addUser = (userData, socketId) => {
    const isExist = users.find(user => user.sub === userData.sub);
    if (!isExist && userData) {
        users.push({ ...userData, socketId });
    }
};

// Get user by sub
const getUser = (userId) => {
    return users.find(user => user.sub === userId);
};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Add user
    socket.on('addUser', userData => {
        console.log("Adding user on backend:", userData?.sub);
        addUser(userData, socket.id);
        io.emit('getUsers', users);
    });

    // Send message
    socket.on('sendMessage', data => {
        console.log("Message received:", data);
        const user = getUser(data.receiverId);
        if (user) {
            io.to(user.socketId).emit('getMessage', data);
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    });
});
