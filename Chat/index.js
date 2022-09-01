const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
//const axios = require("axios")

app.get("/", (req,res) =>{
    res.sendFile(__dirname+"/files/index.html");
})

let getBefehle = ["/aktStand"]

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {
        if(getBefehle.some((elem)=> elem == msg )) {
            console.log("incomming Befehlt: "+ msg)
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: msg,
                method: 'GET',
              };
              const req = http.request(options, res => {
                retMsg = res.on('data', d => {
                    socket.emit('game event', JSON.parse(d.toString()).message)
                });
              });
              
              req.on('error', error => {
                console.error(error);
              });
              
              req.end();
            }
        else{
            console.log('message: ' + msg);
            io.emit('chat message', msg);
        }
    });

    socket.on('gameEvent', (msg) => {
        console.log(msg)
    })

    socket.on('disconnect', ()=>{
        console.log("User disconnected");
    })
});

let port = process.env.PORT || 3001;
server.listen(port,()=> console.log("server listening on port:" + port))