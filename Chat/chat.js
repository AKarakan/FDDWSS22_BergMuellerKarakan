const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const ehbs = require("express-handlebars")
// app.use(express.static(__dirname+"/files"));

app.set('view engine', 'handlebars');
app.engine('handlebars', ehbs.engine({layoutsDir: __dirname+"/views/layouts"}));
// app.set('views', './views');

app.get("/", (req,res) =>{
    console.log(req.query)
    res.render('spieler',{spielername:"Test"});
})

let getBefehle = ["/aktStand","/aktPunkte"]
let postBefehle = ["/start","/wuerfeln"]
let postParamBefehle = [ "/behaupten","/challenge"]

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {

        path = msg.split(" ")[0]
        param = msg.split(" ")[1]
        let spielername = msg.split('#')[1]
        msg = msg.split('#')[0]

        if(getBefehle.some((elem)=> elem == path )) {
            console.log("incomming get Befehlt: "+ path)
            makeGetRequest(path)
            .then((res)=> socket.emit('game event', JSON.parse(res).message))
            .catch((err)=>socket.emit('game event', err))
            
            }
        else if(postBefehle.some((elem)=> elem == path)){
            console.log("incomming post Befehlt: "+ path)
            makePostRequest(path)
            .then((res)=> socket.emit('game event', JSON.parse(res).message))
            .catch((err)=>socket.emit('game event', err))

        }
        else if(postParamBefehle.some((elem)=> elem == path)){
            console.log("incomming post param Befehlt: "+ path)
            makePostRequestWithParam(path,param)
            .then((res)=> {
                console.log(res)
                io.emit('game event', JSON.parse(res).message)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        else{
            console.log('message: ' +spielername + ": "+ msg);
            io.emit('chat message',spielername + ": "+ msg);
        }
    });
    socket.on('disconnect', ()=>{
        console.log("User disconnected");
    })
});

let port = process.env.PORT || 3001;
server.listen(port,()=> console.log("server listening on port:" + port))

function makeGetRequest(path) {  
    return new Promise((resolve, reject) =>{
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
        };
        const req = http.request(options, res => {
            retMsg = res.on('data', d => {
                resolve(d.toString())
            });
        });
        req.on('error', error => {
            console.error(error);
            reject(error)
        });
        
        req.end();
    })
};

function makePostRequest(path){
    return new Promise((resolve, reject) =>{
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
        };
        const req = http.request(options, res => {
            retMsg = res.on('data', d => {
                resolve(d.toString())
            });
        });
        req.on('error', error => {
            console.error(error);
            reject(error)
        });
        
        req.end();
    })
}

function makePostRequestWithParam(path,param){
    return new Promise((resolve, reject) =>{
        postData = JSON.stringify({
            behauptung: param
        })
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };
        const req = http.request(options, res => {
            retMsg = res.on('data', d => {
                resolve(d.toString())
            });
        });
        req.on('error', error => {
            console.error(error);
            reject(error)
        });
        req.write(postData)
        req.end();
    })
}