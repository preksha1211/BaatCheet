import { Server } from "socket.io";

const io=new Server(9000,{
    cors:{
        origin: 'http://localhost:3000'
    }
})

let users = [];

const addUser = (userData, socketId) => {
    const isExist = users.find(user => user.sub === userData.sub);

    if (!isExist) {
        users.push({ ...userData, socketId });
    }
};

const getUser = (userId)=>{
    return users.find(user => user.sub===userId);
}

io.on('connection',(socket) =>{
    console.log('user connected');

    socket.on("addUser", userData=>{
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

  socket.on('sendMessage', data => {

        const user = getUser(data.receiverId        // ✔ correct spelling
);
        io.to(user.socketId).emit('getMessage', data);
    })
})

