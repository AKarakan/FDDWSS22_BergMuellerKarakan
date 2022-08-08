const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

app.get("/", (req,res) =>{
    res.sendFile(__dirname+"/files/index.html");
})

let befehle = []

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        if(msg === "hallo") {
            console.log("hier kommt dann der befehlt für den request in das spiel")
        }
        else{
            console.log('message: ' + msg);
            io.emit('chat message', msg);
        }
    });

    socket.on('disconnect', ()=>{
        console.log("User disconnected");
    })
});

let port = process.env.PORT || 3000;
server.listen(port,()=> console.log("server listening on port:" + port))