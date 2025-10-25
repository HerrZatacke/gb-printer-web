## Utilizzo di un dispositivo WebUSB o WebSerial:
Dopo aver collegato un dispositivo WebUSB o WebSerial, puoi continuare alla [Pagina Galleria](/gallery) o alla [Pagina Iniziale](/) ora.  
Il simbolo USB lampeggerà non appena vengono ricevuti dati.  
Puoi anche accedere a queste opzioni tramite il simbolo USB nella navigazione e dalla [Pagina Impostazioni](/settings).  

## Nota: WebUSB e Web Serial sono simili ma non uguali:
* Mentre Web Serial ha accesso a una normale porta COM e non richiede dispositivi speciali, la funzione non è disponibile sui dispositivi mobili.
* WebUSB richiede determinati microcontrollori in cui il processore ha accesso diretto all'interfaccia USB (ad esempio un Arduino Leonardo). Vedi [webusb per arduino su GitHub](https://github.com/webusb/arduino) per maggiori informazioni.

## Progetti supportati
Questa app web galleria attualmente supporta due dispositivi seriali specifici dedicati alla GameBoy Camera: 
* Ricezione di tiledata e pacchetti catturati stampati da un GameBoy fisico tramite l'[Emulatore Stampante Gameboy Arduino](https://github.com/mofosyne/arduino-gameboy-printer-emulator/) 
* Invio di tiledata da stampare su una Stampante GameBoy fisica tramite la [Super Printer Interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/)

## Dispositivi consigliati (microcontrollori)
La maggior parte degli Arduino generici (ad esempio "Arduino Nano") dovrebbe funzionare senza problemi se lavori su un PC desktop.  
Per poter comunicare con un dispositivo seriale anche su telefoni Android, è necessario un dispositivo programmato con WebUSB abilitato (ad esempio un "Arduino Leonardo" - anche noto come "Arduino Pro Micro").  
Né WebUSB né WebSerial sono disponibili se utilizzi Firefox o qualsiasi dispositivo iOS. 
