class Spieltisch{
    constructor(letzterWuerfelWert, behauptung, aktWert){
        this.letzterWuerfelWert = letzterWuerfelWert
        this.behauptung = behauptung
        this.aktWert = aktWert
    }

    get letzterWuerfelWert() {return this.letzterWuerfelWert}
    get behauptung() {return this.behauptung}
    get aktWert() {return this.aktWert}
    
    set letzterWuerfelWert(x) {
        this.letzterWuerfelWert = x;
    }
    set behauptung(val) {
        this.behauptung = val
    }
    set aktWert(val) {
        this.letzterWuerfelWert = this.aktWert
        this.aktWert = val
    }

}

module.exports = Spieltisch;