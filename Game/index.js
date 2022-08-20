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
let spielTisch = {
  letzterWuerfelWert: 0,
  aktWuerfelWert: 0,
  behauptung: 0,

  set aktWuerfelWert(val){
    this.letzterWuerfelWert = this.aktWuerfelWert
    aktWuerfelWert = val
  },
  get aktWuerfelWert() {return aktWuerfelWert}
}

spielerAmTisch.push(new Spieler("abdu",50,"a"));
spielerAmTisch.push(new Spieler("Yasha",50,"b"));
spielerAmTisch.push(new Spieler("Anton",50,"c"));

let curSpieler = spielerAmTisch[1];
let lastSpieler = spielerAmTisch[0];

let aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWuerfelWert = aktWuerfelWert;
spielTisch.behauptung = 41;

console.log(spielTisch)
console.log("spielTisch.aktWuerfelWert: "+spielTisch.aktWuerfelWert)

nextPlayer();

aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWuerfelWert = aktWuerfelWert;
spielTisch.behauptung = 52;

console.log(spielTisch)
console.log("spielTisch.aktWuerfelWert: "+spielTisch.aktWuerfelWert)

dontTrust(aktWuerfelWert)
nextPlayer();

aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWuerfelWert = aktWuerfelWert;
spielTisch.behauptung = 54;

console.log(spielTisch)
console.log("spielTisch.aktWuerfelWert: "+spielTisch.aktWuerfelWert)

nextPlayer();

aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWuerfelWert = aktWuerfelWert;
spielTisch.behauptung = 66;

console.log(spielTisch)
console.log("spielTisch.aktWuerfelWert: "+spielTisch.aktWuerfelWert)

dontTrust(aktWuerfelWert)
nextPlayer();

console.log("spielTisch.aktWuerfelWert: "+spielTisch.aktWuerfelWert)

console.log(spielerAmTisch)

//game.listen(port, ()=>{console.log("server läuft auf port: " + port);})



function dontTrust(behauptung){
  let index = wuerfelWerte.indexOf(behauptung)
  let lastWuerfelWertIndex = wuerfelWerte.indexOf(spielTisch.aktWuerfelWert)
  if (index>lastWuerfelWertIndex) {
    console.log(curSpieler.spielername + " verliert 10 punkte")
    curSpieler.punkte = curSpieler.punkte -10
  }
  else{
    lastSpieler.punkte = lastSpieler.punkte -10
    console.log(lastSpieler.spielername + " verliert 10 punkte")
  }   
}


function nextPlayer(){
  lastSpieler = curSpieler;
  curSpieler = spielerAmTisch[(spielerAmTisch.findIndex((spieler)=> spieler == curSpieler)+1) % spielerAmTisch.length];
}

