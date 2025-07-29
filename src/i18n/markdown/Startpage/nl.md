# [Game Boy Camera Gallery](https://github.com/HerrZatacke/gb-printer-web)

Game Boy Camera Gallery is een web-app om foto's gemaakt met de Game Boy Camera te organiseren, bewerken en delen.

## [Galerij](/gallery)
Bekijk alle geïmporteerde foto's in een responsieve galerij:
- Tag afbeeldingen
- Combineer foto's in afbeeldingsgroepen
- Filter je collectie
- Metadata bekijken van ondersteunde ROMs zoals [Photo!](https://github.com/untoxa/gb-photo) of zelfs de basisinformatie van de originele Game Boy Camera ROM
- Afbeeldingen afdrukken op een originele Game Boy Printer met community-projectapparaten

### Afbeeldingsgroepen
Je kunt gerelateerde afbeeldingen samen organiseren in groepen:
- Je kunt groepen maken door meerdere afbeeldingen te selecteren en ze te groeperen via het contextmenu van een geselecteerde afbeelding
- Groepen kunnen automatisch worden gemaakt tijdens een importproces of bij het genereren van RGB-afbeeldingen
- Je kunt afbeeldingen selecteren om ze tussen groepen te verplaatsen zonder noodzakelijkerwijs een nieuwe groep te maken

## [Seriële Communicatie](/webusb)
Verbind direct met community-projectapparaten via WebSerial:

### Afdrukken op een fysieke Game Boy Printer
- Met WebSerial ingeschakeld kun je afbeeldingen afdrukken op een originele Game Boy Printer met de [Super Printer Interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/) van Raphaël Boichot

### Cartridge Communicatie
- Schakel WebSerial in Chrome in om direct te communiceren met de GBxCart (alleen desktop)
- Gebruik een apparaat met Lesserkuma's firmware voor verschillende apparaten (bijv. [GBxCart RW](https://www.gbxcart.com/), [JoeyJr](https://bennvenn.myshopify.com/products/usb-gb-c-cart-dumper-the-joey-jr), [GBFlash](https://github.com/simonkwng/GBFlash))

### Game Boy Printer Emulators
Verbind een printer-emulator via WebSerial om direct van je Game Boy Camera naar de WebApp af te drukken:
- [arduino-gameboy-printer-emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator) - Arduino-gebaseerde emulator door mofosyne
- [pico-gb-printer](https://github.com/untoxa/pico-gb-printer/) - Raspberry Pi Pico implementatie door untoxa
- [NeoGB-Printer](https://github.com/zenaror/NeoGB-Printer) - Arduino Nano implementatie door Rafael Zenaro
- [wifi-gbp-emulator](https://github.com/HerrZatacke/wifi-gbp-emulator) - ESP8266 WiFi-emulator met geïntegreerde webserver die deze webapp kan hosten

## [Importeren](/import)
Importeer afbeeldingen uit meerdere bronnen via slepen en neerzetten:
- Cartridge savestates (`.sav`-dumps inclusief de 1MB versie van [FlashGBX](https://github.com/lesserkuma/FlashGBX))
- Game Boy Printer seriële hex logs
- Bitmap-bestanden van projecten die alleen eenvoudige afbeeldingen uitvoeren

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
