# Gameboy Printer Web

A basic version of this tool is avaliable [on GitHub-pages](https://herrzatacke.github.io/gb-printer-web/#/)  
This version does not allow listening to your serial ports (yet), but you can still [copy/paste](https://herrzatacke.github.io/gb-printer-web/#/dump) the serial output of the [GBP Emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator)  
This project is meant to replace my [GB printer direct serial to gif converter](https://github.com/HerrZatacke/direct-serial-to-gif-converter) which has too many restrictions due to running in a terminal only.

## Local Setup

You can run this app locally to directly use the gbp-emulator on your serial port 
* Install [node.js](https://nodejs.org/) if you haven't already.
* Check out/clone/download [this repository](https://github.com/HerrZatacke/gb-printer-web")
* Run `npm i` in the root directory via your commandline
* Add a `ports.config.json` in the root dir (see below)
* Run `npm start` via your commandline
* Open [localhost:3000](http://localhost:3000)
* Go to the 'Settings' page and change the 'Remote Socket URL' to `localhost:3001`
* Print something


## Serial Config with `ports.config.json`
Create a file `ports.config.json` in the root dir and configure it like the following example (multiple ports are supported):
``` json
[
  {
    "path": "COM19",
    "baudRate": 115200,
    "dataBits": 8,
    "stopBits": 1,
    "parity": "none"
  },
  ...
]
```

## Future Plans
This tool is meant to be integrated into the [Websocket GBP Emulator](https://github.com/HerrZatacke/websocket-gbp-emulator)

## research
* [Websockets](https://tttapa.github.io/ESP8266/Chap14%20-%20WebSocket.html)
* [Programming a standalone ESP8266](https://www.instructables.com/id/3-Simple-Ways-of-Programming-an-ESP8266-12X-Module/)
* [Deploying your JS App to Github Pages the easy way (or not)](https://medium.com/linagora-engineering/1ef8c48424b7)
* [SSL WebSockets for the Arduino currently not supported](https://github.com/gilmaimon/ArduinoWebsockets/issues/59) 
