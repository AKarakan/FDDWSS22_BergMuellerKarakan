const express = require('express');
const game = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
const Spieler = require("./spieler");
game.use(bodyParser.json());
game.use(express.urlencoded({extended: true}));
game.use(express.json());

let wuerfelWerte = [31,32,41,42,43,51,52,53,54,61,62,63,64,65,11,22,33,44,55,66,21];
let spielerAmTisch = [];
let spielGestartet = false;

let spielTisch = {
  letzterWuerfelWert: 0,
  aktWuerfelWert: 0,
  letzteBehauptung: 0,
  aktBehauptung: 0,
  aktSpieler: null,
  lastSpieler: null,
  
  set aktWuerfelWert(val){
    this.letzterWuerfelWert = this.aktWuerfelWert
    aktWuerfelWert = val
  },
  get aktWuerfelWert() {return aktWuerfelWert},

  set behauptung(val){
    this.letzteBehauptung = this.aktBehauptung
    this.aktBehauptung = val
  },

  reset(){
    this.letzterWuerfelWert = 0,
    this.aktWuerfelWert = 0,
    this.letzteBehauptung = 0,
    this.aktBehauptung = 0
  },
  
  nextPlayer(){
    lastSpieler = aktSpieler;
    aktSpieler = spielerAmTisch[(spielerAmTisch.findIndex((spieler)=> spieler == aktSpieler)+1) % spielerAmTisch.length];
  },

  //dev only
  show(){
    console.log("Letzter Würfelwert " + this.letzterWuerfelWert)
    console.log("akttueller Würfelwert "+ this.aktWuerfelWert)
    console.log("letzte Behauptung "+ this.letzteBehauptung)
    console.log("aktuelle behauptung "+ this.aktBehauptung)
    console.log("letzter Spieler "+ this.lastSpieler)
    console.log("Aktueller Spieler"+ this.aktSpieler)
  }

}

game.post('/join',(req,res) => {
  if(spielGestartet == true) {
    res
    .status(403)
    .send({"message": "Spiel bereits gestartet. Kein Betritt möglich!"})
  }
  else{
    spielerAmTisch.push(new Spieler(req.body.username,50, req.body.token))
    res
    .status(200)
    .send({"message": "Spieler/in "+ req.body.username + " nimm jetzt am Spiel teil"})
  }
})

game.post('/start', (req, res) => {
  if(spielerAmTisch.length < 3){
    res
    .status(409)
    .send({"message": "Das Spiel kann nicht gestartet werden. Es sind nicht genügend Spieler anwesend!"})
  }
  else{
    spielGestartet = true
    
    //set starting players
    spielTisch.aktSpieler = spielerAmTisch[1];
    spielTisch.lastSpieler = spielerAmTisch[0];
    
    res
    .status(200)
    .send({"message": "Das Spiel startet!"})
  }
})

game.post('/wuerfeln',(req,res)=>{
  spielTisch.aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];

  res.status(200).send({"message": "Du hast "+ spielTisch.aktWuerfelWert + "gewürfelt",
  "wuerfelwert": spielTisch.aktWuerfelWert})
})

game.post('/behaupten',(req,res)=>{
  spielTisch.aktBehauptung = req.body.behauptung
  res.status(200).send({"message": "Du hast "+ req.body.behauptung + " gesagt!"})
  spielTisch.nextPlayer();
})

game.post('/dontTrust',(req,res)=>{

  spielTisch.aktBehauptung = req.body.behauptung
  let index = wuerfelWerte.indexOf(spielTisch.aktBehauptung)
  let lastWuerfelWertIndex = wuerfelWerte.indexOf(spielTisch.letzteBehauptung)

  if (index>lastWuerfelWertIndex) {
    console.log(aktSpieler.spielername + " verliert 10 punkte")
    spielerAmTisch[spielerAmTisch.indexOf(aktSpieler)].punkte -= 10 

    //hat der aktuelle spieler verloren?
    if(spielerAmTisch[spielerAmTisch.indexOf(aktSpieler)].punkte <= 0){
      //ja
      spielerAmTisch.splice(spielerAmTisch.indexOf(aktSpieler),1)
      console.log(aktSpieler.spielername+ " hat verloren und hat das spiel verlassen")
      spielTisch.nextPlayer()
    }
  }
  else{
    spielerAmTisch[spielerAmTisch.indexOf(lastSpieler)].punkte -= 10
    console.log(lastSpieler.spielername + " verliert 10 punkte")

    //hat der letzte spieler verloren?
    if(ielerAmTisch[spielerAmTisch.indexOf(lastSpieler)].punkte <= 10 ){
      //ja
      spielerAmTisch.splice(spielerAmTisch.indexOf(lastSpieler),1)
      console.log(lastSpieler.spielername)
      spielTisch.nextPlayer()
    }
  } 
  spielTisch.reset()

  res.redirect('/wuerfeln')
  
})

game.get('/aktStand',(req,res)=>{
  let str = "Letzter Würfelwert: " + this.letzterWuerfelWert +
  " | akttueller Würfelwert: "+ this.aktWuerfelWert+
  " | letzte Behauptung: "+ this.letzteBehauptung+
  " | aktuelle behauptung: "+ this.aktBehauptung+
  " | letzter Spieler: "+ this.lastSpieler+
  " | Aktueller Spieler: "+ this.aktSpieler

  res.status(200).send({"message": str})
 
})

game.listen(port, ()=>{console.log("server läuft auf port: " + port);})


/*
aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWuerfelWert = aktWuerfelWert;
spielTisch.behauptung = 52;

console.log(spielTisch)
console.log("spielTisch.aktWuerfelWert: "+spielTisch.aktWuerfelWert)

spielTisch.dontTrust(aktWuerfelWert)
spielTisch.nextPlayer();

aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWuerfelWert = aktWuerfelWert;
spielTisch.aktBehauptung = 54;

console.log(spielTisch)
console.log("spielTisch.aktWuerfelWert: "+spielTisch.aktWuerfelWert)

spielTisch.nextPlayer();

aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWuerfelWert = aktWuerfelWert;
spielTisch.aktBehauptung = 66;

console.log(spielTisch)
console.log("spielTisch.aktWuerfelWert: "+spielTisch.aktWuerfelWert)

spielTisch.dontTrust(aktWuerfelWert)
spielTisch.nextPlayer();

console.log("spielTisch.aktWuerfelWert: "+spielTisch.aktWuerfelWert)

console.log(spielerAmTisch)

game.listen(port, ()=>{console.log("server läuft auf port: " + port);})
*/