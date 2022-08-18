const express = require('express');
const game = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;
const Spieltisch = require("./spieltisch");
const Spieler = require("./spieler");
game.use(bodyParser.json());
game.use(express.urlencoded({extended: true}));
game.use(express.json());

let wuerfelWerte = [31,32,41,42,43,51,52,53,54,61,62,63,64,65,11,22,33,44,55,66,21];
let spielerAmTisch = [];
let spielTisch = new Spieltisch(0,0,0)

spielerAmTisch.push(new Spieler("abdu",50,"a"));
spielerAmTisch.push(new Spieler("Yasha",50,"b"));
spielerAmTisch.push(new Spieler("Anton",50,"c"));

let curSpieler = spielerAmTisch[1];
let lastSpieler = spielerAmTisch[0];

let aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWert = aktWuerfelWert;
spielTisch.behauptung = 41;
console.log(spielTisch)
nextPlayer();

aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWert = aktWuerfelWert;
spielTisch.behauptung = 52;
console.log(spielTisch)
dontTrust(aktWuerfelWert)
nextPlayer();

aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWert = aktWuerfelWert;
spielTisch.behauptung = 54;
console.log(spielTisch)
nextPlayer();

aktWuerfelWert = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))];
spielTisch.aktWert = aktWuerfelWert;
spielTisch.behauptung = 66;
console.log(spielTisch)
dontTrust(aktWuerfelWert)
nextPlayer();

//game.listen(port, ()=>{console.log("server läuft auf port: " + port);})



function dontTrust(behauptung){
  let index = wuerfelWerte.indexOf(behauptung)
  let lastWuerfelWertIndex = wuerfelWerte.indexOf(spielTisch.aktWert)
  if (index>lastWuerfelWertIndex) console.log(curSpieler.spielername + " verliert 10 punkte")
  else console.log(lastSpieler.spielername + " verliert 10 punkte")

}


function nextPlayer(){
  lastSpieler = curSpieler;
  curSpieler = spielerAmTisch[spielerAmTisch.indexOf[lastSpieler]+1 % spielerAmTisch.length];
}

