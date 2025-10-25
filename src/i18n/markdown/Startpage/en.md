# [Game Boy Camera Gallery](https://github.com/HerrZatacke/gb-printer-web)

Game Boy Camera Gallery is a web app to organise, edit and share shots taken with the Game Boy Camera.

## [Gallery](/gallery)
View and manage all imported shots in an interactive gallery:
- Tag images
- Combine shots into image groups
- Filter your collection
- View metadata from savestates from ROMs like [Photo!](https://github.com/untoxa/gb-photo) or the original Game Boy Camera ROM
- Print images on an original Game Boy Printer using serial communication devices

### Image Groups
Organize related images together in groups:
- Create groups by selecting multiple images and grouping them together through the context menu of a selected image
- Groups can automatically be created during an import process or when generating RGB images
- Select images to move them between groups without necessarily creating a new group

## [Serial Communication](/webusb)
Connect directly to community project devices using WebSerial:

### Printing to a physical Game Boy Printer
- With WebSerial enabled, print images on an original Game Boy Printer using the [Super Printer interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/) by Raphaël Boichot

### Cartridge Communication
- Enable WebSerial in Chrome to directly communicate with the GBxCart (desktop only)
- Use a cartridge reader with Lesserkuma's firmware for loading savestates (e.g. [GBxCart RW](https://www.gbxcart.com/), [JoeyJr](https://bennvenn.myshopify.com/products/usb-gb-c-cart-dumper-the-joey-jr), [GBFlash](https://github.com/simonkwng/GBFlash))

### Game Boy Printer Emulators
Connect a printer emulator through WebSerial to print from your Game Boy Camera directly to the WebApp:
- [arduino-gameboy-printer-emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator) – Arduino-based emulator by mofosyne
- [pico-gb-printer](https://github.com/untoxa/pico-gb-printer/) – Raspberry Pi Pico implementation by untoxa
- [NeoGB-Printer](https://github.com/zenaror/NeoGB-Printer) – Arduino Nano implementation by Rafael Zenaro
- [wifi-gbp-emulator](https://github.com/HerrZatacke/wifi-gbp-emulator) – ESP8266 WiFi emulator with integrated web server that can host this webapp

## [Import](/import)
Import images from multiple sources through Drag-and-drop:
- Cartridge savestates (`.sav`-dumps including the 1MB version from [FlashGBX](https://github.com/lesserkuma/FlashGBX))
- Game Boy Printer serial hex logs
- Bitmap files from projects which only output basic images

## [Frames](/frames)
Add, edit and share Game Boy Camera frames:
- Drop an image (preferably 160 × 144) to create a new frame or generate frames during import from any data source
- Import/export full frame packs as JSON to share with others

## [Palettes](/palettes)
Work with colour palettes:
- Choose from built-in palettes
- Design custom palettes
- Extract colours from regular photographs to create new palettes
- Import/export palettes as JSON to share with others

## [Plugins](/settings/plugins)
Extend the toolbox with community plug-ins:
- «Average» – Create composite images from multiple shots (HDR-style)
- «Custom Pixels» – Replace individual pixels with detailed representations

## [Dropbox Sync](/settings/dropbox)
Keep your gallery in sync across devices. Enable Dropbox and you can synchronize your library.
