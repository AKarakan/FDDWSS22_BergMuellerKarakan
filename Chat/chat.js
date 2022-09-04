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
    let spielername = req.query.spielername
    let id = req.query.id
    let joinAntwort = makePostRequestWithParam("/join", {spielername:spielername, spielerID : id})
    joinAntwort
    .then(res => console.log(JSON.parse(res).message))
    .catch(res => console.log(JSON.parse(res).message))
    res.render('spieler',{spielername:spielername, spielerID : id});
})

let getBefehle = ["/aktStand","/aktPunkte"]
let postBefehle = ["/start","/wuerfeln"]
let postParamBefehle = ["/behaupten","/challenge"]

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {

        //msg Schema: Spieler MSG #name #ID
        //msg Schema: text 1312312#Anton#1231231 
        console.log(msg)
        let pathParam = msg.split("#")[0]
        let spielername = msg.split('#')[1]
        let spielerID = msg.split('#')[2]
        path = pathParam.split(" ")[0]
        param = pathParam.split(" ")[1]
        msg = msg.split('#')[0]

        if(getBefehle.some((elem)=> elem == path )) {
            console.log("incomming get Befehlt: "+ path)
            makeGetRequest(path)
            .then((res)=> socket.emit('game event', JSON.parse(res).message))
            .catch((err)=>socket.emit('game event', JSON.parse(res).message))
            
            }
        else if(postBefehle.some((elem)=> elem == path)){
            console.log("incomming post Befehlt: "+ path)
            makePostRequest(path)
            .then((res)=> socket.emit('game event', JSON.parse(res).message))
            .catch((err)=>socket.emit('game event', JSON.parse(res).message))

        }
        else if(postParamBefehle.some((elem)=> elem == path)){
            console.log("incomming post param Befehlt: "+ path)
            data = {spielername: spielername, data: param, spielerID: spielerID}
            makePostRequestWithParam(path,param)
            .then((res)=> {
                console.log(res)
                io.emit('game event', JSON.parse(res).message)
            })
            .catch((err)=>{
                socket.emit('game event', JSON.parse(res).message)
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

function makePostRequestWithParam(path,data){
    return new Promise((resolve, reject) =>{
        postData = JSON.stringify(data)
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