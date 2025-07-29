# [Game Boy Camera Gallery](https://github.com/HerrZatacke/gb-printer-web)

Game Boy Camera Gallery is a web app to organise, edit and share shots taken with the Game Boy Camera.

## [Gallery](/gallery)
Browse all imported shots in a responsive gallery:
- Tag images
- Combine shots into image groups
- Filter your collection
- View metadata from supported ROMs like [Photo!](https://github.com/untoxa/gb-photo) or even the basic information from the original Game Boy Camera's ROM
- With [WebSerial](/webusb) enabled, print images on an original Game Boy Printer using the [Super Printer interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/) by Raphaël Boichot

## [Import](/import)
Import images from multiple sources through Drag-and-drop:
- Cartridge savestates (`.sav`-dumps including the 1MB version from [FlashGBX](https://github.com/lesserkuma/FlashGBX))
  - Enable [WebSerial](/webusb) in Chrome to directly communicate with the GBxCart (desktop only)
  - Use a device with [Lesserkuma's](https://github.com/lesserkuma) firmware for various devices (e.g. [GBxCart RW](https://www.gbxcart.com/), [JoeyJr](https://bennvenn.myshopify.com/products/usb-gb-c-cart-dumper-the-joey-jr), [GBFlash](https://github.com/simonkwng/GBFlash))
- Game Boy Printer serial hex logs
  - Connect a printer emulator through WebSerial to directly print from your Game Boy Camera
- Raw bitmaps
  - Direct bitmap files from projects that only output basic images
- Exports from various community micro-controller projects:
  - [arduino-gameboy-printer-emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator) - Arduino-based emulator by mofosyne
  - [pico-gb-printer](https://github.com/untoxa/pico-gb-printer/) - Raspberry Pi Pico implementation by untoxa
  - [NeoGB-Printer](https://github.com/zenaror/NeoGB-Printer) - Arduino Nano implementation by Rafael Zenaro
  - [wifi-gbp-emulator](https://github.com/HerrZatacke/wifi-gbp-emulator) - ESP8266 WiFi emulator with integrated web server that can host this webapp

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
- «Average» - Create composite images from multiple shots (HDR-style)
- «Custom Pixels» - Replace individual pixels with detailed representations

## [Dropbox Sync](/settings/dropbox)
Keep your gallery in sync across devices. Enable Dropbox and you can synchronize your library.
