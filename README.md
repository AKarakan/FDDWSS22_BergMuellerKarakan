# Frameworks, Dienste und Daten im Web (FDDW)

## Beschreibung
Dies ist das Repository für die Projektarbeit im Modul "Frameworks, Daten und Dienste im Web" (FDDW) im Rahmen des Schwerpunktbereichs "Web Development". Alle Inhalte bezüglich der Konzeption und Umsetzung werden hier hochgeladen. 

Die Zielsetzung des Projekts lautet wie folgt:

* Anwendung die in Microservices / Komponenten aufgeteilt ist
* Asynchrone Kommunikation zwischen Microservices (bspw. durch Events)
* Anbindung mindestens eines externen (offenen) Datendienstes
* Es muss State geben! (Ohne State ist alles möglich)
* Einfache! Web-UI zur Interaktion mit der Anwendung
* Deployment der Anwendung
* Betriebskonzept
* Dokumentation und Nachvollziehbarkeit in GitHub

***

## Bisherige Projektideen

### 1. Karten- oder Würfelspiel
Ein Multiplayer-Spiel, das auf einem bereits bestehenden Karten oder Würfelspiel basiert.
* Microservices / Komponenten: einzelne Spieler*innen, "Spieltisch" (also Spielbrett/Kartenstapel/etc.; können je nach Granularität ggf. auch als einzelne Komponenten umgesetzt werden)
* Asynchrone Kommunikation: rundenbasiertes Spielprinzip
* Externer (offener) Datendienst: _Ein externes Login-System, welches ein schon bestehenden Account in dem jeweiligen System, für unseren zur verfügung stellt. (Ory, OpenIAM, Google, Apache Syncope, Twitter, etc.)_

### 2. Chatsystem
Mehrere Chaträume, in denen sich die Chat-Teilnehmer anmelden und Nachrichten austauschen können.
* Microservices / Komponenten: Chat-Teilnehmer*innen, Chatraum
* Asynchrone Kommunikation: ein event beim Senden, ein event beim Empfangen
* Externer (offener) Datendienst:Fosscord, oder Eigenbau mit socket.io

***

Projektteam: 
* Anton Berg 
* Abdurrahman Karakan
* Yasha Müller
