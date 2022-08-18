class Spieler {
    constructor(spielername,punkte = 50, token){
        this.spielername = spielername;
        this.punkte = punkte;
        this.token = token;
    }
    get spielername(){ return this.spielername}
    get punkte() {return this.punkte}
    get token() { return this.token}

    set punkte(val) {this.punkte = val}
}