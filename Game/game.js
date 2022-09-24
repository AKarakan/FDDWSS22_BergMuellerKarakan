const express = require('express');
const game = express();
const bodyParser = require('body-parser')
const port = 3004;
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
  
  setAktWuerfelWert(val){
    this.letzterWuerfelWert = this.aktWuerfelWert
    this.aktWuerfelWert = val
  },

  setBehauptung(val){
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
    this.lastSpieler = this.aktSpieler;
    this.aktSpieler = spielerAmTisch[(spielerAmTisch.findIndex((spieler)=> spieler == spielTisch.aktSpieler)+1) % spielerAmTisch.length];
  },

  //dev only
  show(){
    return "Letzter Würfelwert " + this.letzterWuerfelWert+ " | "+ 
    "akttueller Würfelwert "+ this.aktWuerfelWert+" | "+ 
    "letzte Behauptung "+ this.letzteBehauptung+" | "+ 
    "aktuelle behauptung "+ this.aktBehauptung+" | "+ 
    "letzter Spieler "+ this.lastSpieler.spielername+" | "+ 
    "Aktueller Spieler "+ this.aktSpieler.spielername+" | "
  }

}

game.post('/join',(req,res) => {
  if(spielGestartet == true) {
    console.log("Spiel bereits gestartet. Kein Betritt möglich!")
    res
    .status(403)
    .send({"messageToOne": "Spiel bereits gestartet. Kein Betritt möglich!"})
  }
  else{
    let spielername = req.body.spielername
    let spielerID = req.body.spielerID

    //check: ist der spieler schon drinne?
    let index = spielerAmTisch.findIndex(spieler => spieler.token === spielerID )
    if (index === -1){ 
      spielerAmTisch.push(new Spieler(spielername,50, spielerID))
      console.log("Spieler/in "+ spielername + " nimm jetzt am Spiel teil")
      console.log(spielerAmTisch)
      res
      .status(200)
      .send({"messageToAll": "Spieler/in "+ spielername + " nimm jetzt am Spiel teil"})
    }
    else{
      res.status(400).send({"messageToOne": "Spieler/in "+spielername+" nimmt schon teil!"})
    }
  }
})

game.post('/start', (req, res) => {

  //test zwecken 3 falsche Spieler
  // spielerAmTisch.push(new Spieler("Yasha",50, "a"))
  // spielerAmTisch.push(new Spieler("Anton",50, "b"))
  // spielerAmTisch.push(new Spieler("Abdu",50, "c"))

  if(spielerAmTisch.length < 3){
    res
    .status(409)
    .send({"messageToAll": "Das Spiel kann nicht gestartet werden. Es sind nicht genügend Spieler anwesend! "})
  }
  else{
    spielGestartet = true
    
    //set starting players
    spielTisch.aktSpieler = spielerAmTisch[1];
    spielTisch.lastSpieler = spielerAmTisch[0];
    
    res
    .status(200)
    .send({"messageToAll": "Das Spiel startet! Spieler: "+ spielTisch.aktSpieler.spielername+" ist dran!"})
  }
})

game.post('/wuerfeln',(req,res)=>{
  //ist der Spieler dran?
  if(req.body.spielername == spielTisch.aktSpieler.spielername){
    //ja, ist dran
    let x = wuerfelWerte[Math.floor((Math.random() * wuerfelWerte.length))]
    console.log("wuerfel wert: "+x)
  
    spielTisch.setAktWuerfelWert(x)
    res.status(200).send({"messageToOne": "Du hast "+ spielTisch.aktWuerfelWert + "gewürfelt",
    "messageToAll": "Spieler "+spielTisch.aktSpieler.spielername+" würfelt gerade."})
  }
  else{
    //nein, ist nicht dran
    res.status(401).send({"messageToOne":"Du bist gerade nicht an der Reihe! "+ spielTisch.aktSpieler.spielername+ " ist an der Reihe!"})
  }
})

game.post('/behaupten',(req,res)=>{
  //ist der Spieler dran?
  if(req.body.spielername == spielTisch.aktSpieler.spielername){
    //ja, ist dran
    spielTisch.setBehauptung(req.body.data)
    let outputMessage =  "Spieler "+spielTisch.aktSpieler.spielername + " hat " + spielTisch.aktBehauptung + " gesagt! "
    spielTisch.nextPlayer();
    outputMessage += "Spieler "+spielTisch.aktSpieler.spielername + " ist nun dran!"
    res.status(200).send({"messageToAll": outputMessage})
  }
  else{
    //nein ist nicht dran
    res.status(401).send({"messageToOne":"Du bist gerade nicht an der Reihe! "+ spielTisch.aktSpieler.spielername+ " ist an der Reihe!"})
  }
})

game.post('/challenge',(req,res)=>{
  //ist der Spieler dran?
  if(req.body.spielername == spielTisch.aktSpieler.spielername){
    //ja, ist dran
    // spielTisch.setBehauptung(req.body.data)
    // wuerfelWerte.indexOf(spielTisch.aktBehauptung)
    let aktBehauptungsIndex = wuerfelWerte.findIndex(wuerfelWert => wuerfelWert === spielTisch.aktBehauptung)
    // wuerfelWerte.indexOf(spielTisch.aktWuerfelWert)
    let lastWuerfelWertIndex = wuerfelWerte.findIndex(wuerfelWert => wuerfelWert === spielTisch.aktWuerfelWert)
    let output = ""

    //b66 w62
    if (aktBehauptungsIndex == lastWuerfelWertIndex) {
      output = spielTisch.aktSpieler.spielername + " verliert 10 punkte"
      // spielerAmTisch[spielerAmTisch.indexOf(spielTisch.aktSpieler)].punkte -= 10 
      spielerAmTisch[spielerAmTisch.findIndex(spieler => spieler.token === spielTisch.aktSpieler.token)].punkte -= 10

      //hat der aktuelle spieler verloren?
      if(spielerAmTisch[spielerAmTisch.findIndex(spieler => spieler.token === spielTisch.aktSpieler.token)].punkte <= 0){
        //ja
        spielerAmTisch.splice(spielerAmTisch[spielerAmTisch.findIndex(spieler => spieler.token === spielTisch.aktSpieler.token)],1)
        output = aktSpieler.spielername+ " hat verloren und hat das spiel verlassen"
        spielTisch.nextPlayer()
      }
    }
    else{
      // spielerAmTisch[spielerAmTisch.indexOf(spielTisch.lastSpieler)].punkte -= 10
      spielerAmTisch[spielerAmTisch.findIndex(spieler => spieler.token === spielTisch.lastSpieler.token)].punkte -= 10
      output = spielTisch.lastSpieler.spielername + " verliert 10 punkte"

      //hat der letzte spieler verloren?
      if(spielerAmTisch[spielerAmTisch.findIndex(spieler => spieler.token === spielTisch.lastSpieler.token)].punkte <= 10 ){
        //ja
        spielerAmTisch.splice(spielerAmTisch[spielerAmTisch.findIndex(spieler => spieler.token === spielTisch.lastSpieler.token)],1)
        output += ". Spieler "+spielTisch.lastSpieler.spielername+" hat verloren und wurde entfernt!"
        spielTisch.nextPlayer()
        output += " Nächster Spieler ist: " +spielTisch.aktSpieler.spielername
      }
    } 
    spielTisch.reset()
    console.log(spielerAmTisch)
    res.status(200).send({"messageToAll": output})
  }
  else{
    //nein, ist nicht dran
    res.status(401).send({"messageToOne":"Du bist gerade nicht an der Reihe! "+ spielTisch.aktSpieler.spielername+ " ist an der Reihe!"})
  }
  
})

game.get('/aktStand',(req,res)=>{
  let str = spielTisch.show()
  console.log(str)

  res.status(200).send({"messageToOne": str})
 
})

game.get('/aktPunkte',(req,res)=>{
  let output = ""
  for (i in spielerAmTisch){
    output += "Spieler: " + spielerAmTisch[i].spielername +", Punkte: " +spielerAmTisch[i].punkte +" | "
  }
  res.status(200).send({"messageToOne": output})
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