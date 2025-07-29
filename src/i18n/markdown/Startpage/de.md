# [Game Boy Camera Gallery](https://github.com/HerrZatacke/gb-printer-web)

## [Galerie](/gallery)
Durchsuche alle importierten Aufnahmen in einer responsiven Galerie:
- Bilder mit Tags versehen
- Aufnahmen in Bildgruppen zusammenfassen
- Deine Sammlung filtern
- Metadaten von unterstützten ROMs wie [Photo!](https://github.com/untoxa/gb-photo) oder sogar die grundlegenden Informationen vom ursprünglichen Game Boy Camera ROM anzeigen
- Mit aktiviertem [WebSerial](/webusb) Bilder auf einem originalen Game Boy Printer drucken mit dem [Super Printer Interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/) von Raphaël Boichot
Game Boy Camera Gallery ist eine Web-App zum Organisieren, Bearbeiten und Teilen von Aufnahmen der Game Boy Camera.

## [Import](/import)
Importiere Bilder aus verschiedenen Quellen per Drag-and-Drop:
- Cartridge-Spielstände („.sav“-Dumps einschließlich der 1MB-Version von [FlashGBX](https://github.com/lesserkuma/FlashGBX))
  - Aktiviere [WebSerial](/webusb) in Chrome, um direkt mit dem GBxCart zu kommunizieren (nur Desktop)
  - Verwende ein Gerät mit [Lesserkuma's](https://github.com/lesserkuma) Firmware für verschiedene Geräte (z.B. [GBxCart RW](https://www.gbxcart.com/), [JoeyJr](https://bennvenn.myshopify.com/products/usb-gb-c-cart-dumper-the-joey-jr), [GBFlash](https://github.com/simonkwng/GBFlash))
- Game Boy Printer serielle Hex-Logs
  - Verbinde einen Drucker-Emulator über WebSerial, um direkt von deiner Game Boy Camera zu drucken
- Einfache Bitmaps
  - Direkte Bitmap-Dateien von Projekten, die nur einfache Bilder ausgeben
- Exporte von verschiedenen Community-Mikrocontroller-Projekten:
  - [arduino-gameboy-printer-emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator) – Arduino-basierter Emulator von mofosyne
  - [pico-gb-printer](https://github.com/untoxa/pico-gb-printer/) – Raspberry Pi Pico Implementierung von untoxa
  - [NeoGB-Printer](https://github.com/zenaror/NeoGB-Printer) – Arduino Nano Implementierung von Rafael Zenaro
  - [wifi-gbp-emulator](https://github.com/HerrZatacke/wifi-gbp-emulator) – ESP8266 WiFi-Emulator mit integriertem Webserver, der diese Webapp hosten kann

## [Frames](/frames)
Game Boy Camera Frames hinzufügen, bearbeiten und teilen:
- Ein Bild (vorzugsweise 160 × 144) ablegen, um einen neuen Frame zu erstellen oder Frames während des Imports aus beliebigen Datenquellen generieren
- Vollständige Frame-Pakete als JSON importieren/exportieren, um sie mit anderen zu teilen

## [Paletten](/palettes)
Mit Farbpaletten arbeiten:
- Aus integrierten Paletten wählen
- Benutzerdefinierte Paletten entwerfen
- Farben aus normalen Fotografien extrahieren, um neue Paletten zu erstellen
- Paletten als JSON importieren/exportieren, um sie mit anderen zu teilen

## [Plugins](/settings/plugins)
Die Toolbox mit Community-Plugins erweitern:
- „Average“ – Zusammengesetzte Bilder aus mehreren Aufnahmen erstellen (HDR-Stil)
- „Custom Pixels“ – Einzelne Pixel durch detaillierte Darstellungen ersetzen

## [Dropbox Sync](/settings/dropbox)
Halte deine Galerie über alle Geräte hinweg synchron. Aktiviere Dropbox und du kannst deine Bibliothek synchronisieren.
