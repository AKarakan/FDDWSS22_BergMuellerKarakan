class Spieler {
    constructor(spielername,punkte = 50, token){
        this.spielername = spielername;
        this.punkte = punkte;
        this.token = token;
    }
}

module.exports = Spieler;