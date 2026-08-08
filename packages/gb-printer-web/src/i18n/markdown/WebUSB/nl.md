## Een WebUSB of WebSerial apparaat gebruiken:
Na het verbinden van een WebUSB of WebSerial apparaat kun je nu doorgaan naar de [Galerij Pagina](/gallery) of [Home Pagina](/).  
Het USB-symbool zal pulseren zodra er gegevens worden ontvangen.    
Je kunt deze opties ook bereiken via het USB-symbool in de navigatie en de [Instellingen Pagina](/settings).  

## Let op: WebUSB en Web Serial zijn vergelijkbaar maar niet hetzelfde:
* Hoewel Web Serial toegang heeft tot een gewone COM-poort en geen speciale apparaten vereist, is de functie niet beschikbaar op mobiele apparaten.
* WebUSB vereist bepaalde microcontrollers waarbij de processor directe toegang heeft tot de USB-interface (bijv. een Arduino Leonardo). Zie [webusb for arduino op GitHub](https://github.com/webusb/arduino) voor meer informatie.

## Ondersteunde Projecten
Deze galerij web-app ondersteunt momenteel twee specifieke seriële apparaten gewijd aan de GameBoy Camera: 
* Het ontvangen van tiledata en vastgelegde pakketten geprint van een fysieke GameBoy via de [Arduino Gameboy Printer Emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator/) 
* Het verzenden van tiledata om te printen op een fysieke GameBoy Printer via de [Super Printer Interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/)

## Aanbevolen Apparaten (microcontrollers)
De meeste generieke Arduino's (bijv. „Arduino Nano“) zouden zonder problemen moeten werken als je op een desktop PC werkt.  
Om ook te kunnen communiceren met een serieel apparaat op Android telefoons is een apparaat vereist dat geprogrammeerd is met WebUSB ingeschakeld (bijv. een „Arduino Leonardo“ – ook wel „Arduino Pro Micro“).  
Noch WebUSB noch WebSerial is beschikbaar wanneer je Firefox gebruikt of een iOS apparaat.
