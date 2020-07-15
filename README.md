# Game Boy Printer Web

## Basic usage
* choose a [color palette](#/palettes)
* [paste your exports](#/import) into a textfield (or simply drag and drop your dump(s) into this window)
* check your images [in the gallery](#/gallery)
* You can also try to drag/drop your cartridge dump into this window  

## Supported formats
* This Project is mainly built around the serial output of the original [GBP Emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator)
* Cart .SAV files are also supported experimentally  
Currently I assume the size is exactly `131072 bytes`, as this is the only sample of a cartridge dump I have.  
If it does not work, [please open an issue](https://github.com/HerrZatacke/gb-printer-web/issues) and attach your file.  


## ToDos
* User manual
* Global Storage for images 
* Edit palettes
* Export without frame
* Other blendmodes than multiply for RGB-Images
* trash bin for raw-data of deleted images (must implement global storage first for this)
* Allow some gesture/swipe in gallery on touch devices

## Local Setup
You can run this app locally to directly use the gbp-emulator on your serial port 
* Install [node.js](https://nodejs.org/) if you haven't already.
* Check out/clone/download [this repository](https://github.com/HerrZatacke/gb-printer-web)
* Run `npm i` in the root directory via your commandline
* Add a `config.json` in the root dir (see below)
* Run `npm start` via your commandline
* Open [localhost:3000](http://localhost:3000)
* Go to the 'Settings' page and change the 'Remote Socket URL' to `localhost:3001`
* Print something


## Serial config with `config.json`
Create a file `config.json` in the root dir and configure it like the following example (multiple ports are supported):
``` json
{
  "ports": [
    {
      "path": "COM19",
      "baudRate": 115200,
      "dataBits": 8,
      "stopBits": 1,
      "parity": "none",
      "retry": false
    },
    ...
  ] 
}
```
you can set `retry` to a number of milliseconds after which a retry will be attempted to open the port.

## Optional deployment config with `config.json`
Add a `deploy` section in `config.json` to automatically copy the created files to another location.  
If you set the option `gzip` to `true`, each file will be separately compressed. Useful for servers capable serving pre-zipped files. This saves ~1kB storage space which is very useful on [small systems](https://github.com/HerrZatacke/wifi-gbp-emulator).
``` json
{
  "ports": [...], 
  "deploy": {
    "dir": "/copy/all/files/to/that/folder",
    "gzip": true
  }
}
```

## Future Plans
This tool is partially integrated into the [WiFi GBP Emulator](https://herrzatacke.github.io/wifi-gbp-emulator/), for which, you'll best [use the latest release](https://github.com/HerrZatacke/gb-printer-web/releases)

## Links and research
* The source to this project is [available on GitHub](https://github.com/HerrZatacke/gb-printer-web)
* A basic version of this tool is avaliable [on GitHub-pages](https://herrzatacke.github.io/gb-printer-web/#/)  
* This project is meant to replace my [GB printer direct serial to gif converter](https://github.com/HerrZatacke/direct-serial-to-gif-converter)

### Research
* Tutorial on how to work with an ESP8266 by [ttapa: ESP8266 Beginner's Guide](https://tttapa.github.io/ESP8266/Chap01%20-%20ESP8266.html)  
* [Programming a standalone ESP8266](https://www.instructables.com/id/3-Simple-Ways-of-Programming-an-ESP8266-12X-Module/)
* [Deploying your JS App to Github Pages the easy way (or not)](https://medium.com/linagora-engineering/1ef8c48424b7)
