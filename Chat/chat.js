const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const ehbs = require("express-handlebars")
const mongoose = require("mongoose")
require('dotenv').config({path: "./config.env"})
const User = require("./models/User")

app.set('view engine', 'handlebars');
app.engine('handlebars', ehbs.engine({layoutsDir: __dirname+"/views/layouts"}));

app.get("/", (req,res) =>{

    console.log(req.query)
    let spielername = req.query.spielername
    let id = req.query.id

    mongoose.connect(process.env.MONGO_URI)
    User.findOne({googleId: id}, function (err, docs) {
        if (err){
            //redirect to google login
            res.redirect("http://localhost:3005/failure")
            console.log("Fehler in der Verbindung zwischen Mongoose und der Anwendung!")
        }
        else{
            if(docs){
                console.log("Result : ", docs);
                let joinAntwort = makePostRequestWithParam("/join", {spielername:spielername, spielerID : id})
                joinAntwort
                .then((response) => {
                    //der spieler tritt einem noch nicht gestarteten spiel bei
                    console.log(JSON.parse(response).messageToOne)
                    if( "Spiel bereits gestartet. Kein Betritt möglich!" == JSON.parse(response).messageToOne) {
                        res.redirect("http://localhost:3005/lobby")
                    }
                    else{
                        res.render('spieler',{spielername:spielername, spielerID : id});
                    }
                })
                .catch((response) => {
                    let err = JSON.parse(response).messageToOne;
                    //res.redirect(302,"http://localhost:3005/")
                    console.log(err)
                })
            }
            else{
                res.redirect(302,"http://localhost:3005/")
            }
        }
    });

})

let getBefehle = ["/aktStand","/aktPunkte"]
let postBefehle = ["/start"]
let postParamBefehle = ["/behaupten","/challenge","/wuerfeln"]

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {

        //msg Schema: Spieler MSG #name #ID
        //msg Schema: text 1312312#Anton#1231231 
        console.log(msg)
        let pathParam = msg.split("#")[0]
        let spielername = msg.split('#')[1]
        let spielerID = msg.split('#')[2]
        let path = pathParam.split(" ")[0]
        let param = pathParam.split(" ")[1] //spezialfall "/wuerfeln 00" 
        msg = msg.split('#')[0]

        if(getBefehle.some((elem)=> elem == path )) {
            console.log("incomming get Befehlt: "+ path)
            makeGetRequest(path)
            .then((res)=> {
                if(JSON.parse(res).messageToOne){
                    socket.emit('game event', JSON.parse(res).messageToOne)
                }
                if(JSON.parse(res).messageToAll){
                    // io.emit('game event', JSON.parse(res).messageToAll)
                    socket.broadcast.emit('game event', JSON.parse(res).messageToAll)
                }
            })
            .catch((err)=>{
                socket.emit('game event', JSON.parse(err).messageToAll)
            })
            
        }
        else if(postBefehle.some((elem)=> elem == path)){
            console.log("incomming post Befehlt: "+ path)
            makePostRequest(path)
            .then((res)=> {
                if(JSON.parse(res).messageToOne){
                    socket.emit('game event', JSON.parse(res).messageToOne)
                }
                if(JSON.parse(res).messageToAll){
                    // io.emit('game event', JSON.parse(res).messageToAll)
                    socket.broadcast.emit('game event', JSON.parse(res).messageToAll)
                }
            })
            .catch((err)=>{
                socket.emit('game event', JSON.parse(err).messageToAll)
            })

        }
        else if(postParamBefehle.some((elem)=> elem == path)){
            console.log("incomming post param Befehlt: "+ path)
            if(!param) param = "00"
            let data = {spielername: spielername, data: param, spielerID: spielerID}
            makePostRequestWithParam(path,data)
            .then((res)=> {
                if(JSON.parse(res).messageToOne){
                    socket.emit('game event', JSON.parse(res).messageToOne)
                }
                if(JSON.parse(res).messageToAll){
                    // io.emit('game event', JSON.parse(res).messageToAll)
                    socket.broadcast.emit('game event', JSON.parse(res).messageToAll)
                }
            })
            .catch((err)=>{
                socket.emit('game event', JSON.parse(err).messageToAll)
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

let port = process.env.CHAT_PORT || 3001;
server.listen(port,()=> console.log("server listening on port:" + port))

function makeGetRequest(path) {  
    return new Promise((resolve, reject) =>{
        const options = {
            hostname: 'game',
            port: 3004,
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
            hostname: 'game',
            port: 3004,
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
            hostname: 'game',
            port: 3004,
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