# Game Boy Printer Web

## Basic usage
* choose a [color palette](#/palettes)
* [paste your exports](#/import) into a textfield (or simply drag and drop your dump(s) into this window)
* check your images [in the gallery](#/gallery)
* You can also try to drag/drop your cartridge dump into this window  

## Supported formats
* This Project is mainly built around the serial output of the original [GBP Emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator)
* Cart .SAV files are also supported. The previously selected frame will be applied as well. If you're importing from a JP-Cartridge (Pocket Camera), you may want to change the "Frames when importing Cartridge dumps" option in the [settings page](#/settings)    

## Frames
In a recent change (Version 1.7.0) the pre-compiled frames have been removed from this application.  
The application now however gives you the opportunity to add all frames you like by yourself and also share them with others.  
Maybe you have designed some frames by yourself, or you have aquired some previously unknown frames.

### Uploading your own frames
You can upload your own frames by dragging any image into this app.  
Dimensions of 160x144 are highly recommended, otherwise the image will be automatically scaled to size.  
A lossles filetype is also recommended (e.g `.png` or `.webp`)
After dragging your image into the app, you will be asked on how to import the frame.

### Exporting/Importing your frames
[In the import tab](#/import) you can find an "Export frames" button. The resulting `.json` file can be shared and will contain all of your frames.  
This `.json` file can be dragged into the application and will add all frames from that export to your application.  

## Development usage
The following ptions apply if you plan on contributong to this app:

### Optional deployment config with `config.json`
Add a `deploy` section in `config.json` to automatically copy the created files to another location ([e.g your arduino project](https://github.com/HerrZatacke/wifi-gbp-emulator)).  
If you set the option `gzip` to `true`, each file will be separately compressed. Useful for servers capable serving pre-zipped files. This saves ~1kB storage space.
``` json
{
  "ports": [...], 
  "deploy": {
    "dir": "/copy/all/files/to/that/folder",
    "gzip": true
  }
}
```

### Local Setup
* Install [node.js](https://nodejs.org/) if you haven't already.
* Check out/clone/download [this repository](https://github.com/HerrZatacke/gb-printer-web)
* Run `npm i` in the root directory via your commandline
* Add a `config.json` in the root dir (see above)
* Run `npm start` via your commandline
* Open [localhost:3000](http://localhost:3000)

### Links and research
* The source to this project is [available on GitHub](https://github.com/HerrZatacke/gb-printer-web)
* A basic version of this tool is avaliable [on GitHub-pages](https://herrzatacke.github.io/gb-printer-web/#/)  
* This project has replaced my [GB printer direct serial to gif converter](https://github.com/HerrZatacke/direct-serial-to-gif-converter)
* Also check out the [Gameboy Camera Discord](https://discord.gg/Kxhjg3qN) 
* [Lots of helpful GameBoy and GameBoy Camera resources](https://github.com/gbdev/awesome-gbdev)

#### Research
* Tutorial on how to work with an ESP8266 by [ttapa: ESP8266 Beginner's Guide](https://tttapa.github.io/ESP8266/Chap01%20-%20ESP8266.html)  
* [Programming a standalone ESP8266](https://www.instructables.com/id/3-Simple-Ways-of-Programming-an-ESP8266-12X-Module/)
* [Deploying your JS App to Github Pages the easy way (or not)](https://medium.com/linagora-engineering/1ef8c48424b7)
