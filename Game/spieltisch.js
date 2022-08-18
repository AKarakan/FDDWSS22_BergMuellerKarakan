class Spieltisch{
    constructor(newLetzterWuerfelWert, newBehauptung, newAktWert){
        this.letzterWuerfelWert = newLetzterWuerfelWert
        this.behauptung = newBehauptung
        this.aktWert = newAktWert
    }

    get letzterWuerfelWert() {return this.letzterWuerfelWert}
    get behauptung() {return this.behauptung}
    get aktWert() {return this._aktWert}
    
    set letzterWuerfelWert( newLetzterWuerfelWert) {
        this._letzterWuerfelWert = newLetzterWuerfelWert
    }
    set behauptung(newBehauptung) {
        this._behauptung = newBehauptung
    }
    set aktWert(newAktWert) {
        this._letzterWuerfelWert = this.aktWert
        this._aktWert = newAktWert
    }

}

module.exports = Spieltisch;