# [Game Boy Camera Gallery](https://github.com/HerrZatacke/gb-printer-web)

Game Boy Camera Gallery is een web-app om foto's gemaakt met de Game Boy Camera te organiseren, bewerken en delen.

## [Import](/import)
Importeer afbeeldingen uit meerdere bronnen via Drag-and-drop:
- Cartridge savestates („.sav“-dumps inclusief de 1MB versie van [FlashGBX](https://github.com/lesserkuma/FlashGBX))
  - Schakel [WebSerial](/webusb) in Chrome in om direct te communiceren met de GBxCart (alleen desktop)
  - Gebruik een apparaat met [Lesserkuma's](https://github.com/lesserkuma) firmware voor verschillende apparaten (bijv. [GBxCart RW](https://www.gbxcart.com/), [JoeyJr](https://bennvenn.myshopify.com/products/usb-gb-c-cart-dumper-the-joey-jr), [GBFlash](https://github.com/simonkwng/GBFlash))
- Game Boy Printer seriële hex logs
  - Verbind een printer emulator via WebSerial om direct te printen vanaf je Game Boy Camera
- Eenvoudige bitmaps
  - Directe bitmap bestanden van projecten die alleen basis afbeeldingen uitvoeren
- Exports van verschillende community micro-controller projecten:
  - [arduino-gameboy-printer-emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator) – Arduino-gebaseerde emulator door mofosyne
  - [pico-gb-printer](https://github.com/untoxa/pico-gb-printer/) – Raspberry Pi Pico implementatie door untoxa
  - [NeoGB-Printer](https://github.com/zenaror/NeoGB-Printer) – Arduino Nano implementatie door Rafael Zenaro
  - [wifi-gbp-emulator](https://github.com/HerrZatacke/wifi-gbp-emulator) – ESP8266 WiFi emulator met geïntegreerde webserver die deze webapp kan hosten

## [Galerij](/gallery)
Bekijk alle geïmporteerde foto's in een responsieve galerij:
- Tag afbeeldingen
- Combineer foto's in afbeeldingsgroepen
- Filter je collectie
- Bekijk metadata van ondersteunde ROMs zoals [Photo!](https://github.com/untoxa/gb-photo) of zelfs de basis informatie van de originele Game Boy Camera ROM
- Met [WebSerial](/webusb) ingeschakeld, print afbeeldingen op een originele Game Boy Printer met de [Super Printer Interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/) door Raphaël Boichot

## [Frames](/frames)
Game Boy Camera frames toevoegen, bewerken en delen:
- Sleep een afbeelding (bij voorkeur 160 × 144) om een nieuwe frame te maken of genereer frames tijdens import van elke databron
- Importeer/exporteer volledige frame pakketten als JSON om te delen met anderen

## [Paletten](/palettes)
Werk met kleurenpaletten:
- Kies uit ingebouwde paletten
- Ontwerp aangepaste paletten
- Extraheer kleuren uit gewone foto's om nieuwe paletten te maken
- Importeer/exporteer paletten als JSON om te delen met anderen

## [Plugins](/settings/plugins)
Breid de toolbox uit met community plug-ins:
- „Average“ – Maak samengestelde afbeeldingen van meerdere foto's (HDR-stijl)
- „Custom Pixels“ – Vervang individuele pixels door gedetailleerde representaties

## [Dropbox Sync](/settings/dropbox)
Houd je galerij gesynchroniseerd tussen apparaten. Schakel Dropbox in en je kunt je bibliotheek synchroniseren.
