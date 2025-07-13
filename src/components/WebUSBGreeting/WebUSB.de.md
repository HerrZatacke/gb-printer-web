## Verwendung eines WebUSB- oder WebSerial-Geräts:
Nachdem du ein WebUSB- oder WebSerial-Gerät verbunden hast, kannst du jetzt zur [Galerie-Seite](#/gallery) oder zur [Startseite](#/home) weitergehen.  
Das USB-Symbol pulsiert, sobald Daten empfangen werden.  
Du kannst die Optionen auch über das USB-Symbol in der Navigation und die [Einstellungsseite](#/settings) aufrufen.

## Hinweis: WebUSB und Web Serial sind ähnlich, aber nicht identisch:
* Web Serial hat Zugriff auf einen normalen COM-Port und benötigt keine speziellen Geräte, ist aber auf Mobilgeräten nicht verfügbar.
* WebUSB erfordert bestimmte Mikrocontroller, bei denen der Prozessor direkten Zugriff auf die USB-Schnittstelle hat (z. B. ein Arduino Leonardo). Siehe [webusb for arduino auf GitHub](https://github.com/webusb/arduino) für weitere Informationen.

## Unterstützte Projekte
Diese Galerie-Webanwendung unterstützt derzeit zwei spezielle serielle Geräte, die sich auf die GameBoy-Kamera beziehen:
* Empfang von Tile-Daten und gedruckten Paketen von einem physischen GameBoy über den [Arduino Gameboy Printer Emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator/)
* Senden von Tile-Daten zum Drucken auf einem physischen GameBoy-Drucker über das [Super Printer Interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/)

## Empfohlene Geräte (Mikrocontroller)
Die meisten generischen Arduinos (z. B. „Arduino Nano“) sollten auf einem Desktop-PC problemlos funktionieren.  
Um auch auf Android-Smartphones mit einem seriellen Gerät kommunizieren zu können, wird ein Gerät benötigt, das mit aktivierter WebUSB-Unterstützung programmiert wurde (z. B. ein „Arduino Leonardo“ – auch bekannt als „Arduino Pro Micro“).  
Weder WebUSB noch WebSerial sind verfügbar, wenn du Firefox oder ein iOS-Gerät verwendest.
