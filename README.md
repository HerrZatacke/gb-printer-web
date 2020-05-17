# Gameboy Printer Web

## Setup

You can run this app locally to directly use the gbp-emulator on your serial port 
* install [node.js](https://nodejs.org/) if you haven't already.
* check out/clone/download [this repository](https://github.com/HerrZatacke/gb-printer-web")
* run `npm i` in the root directory
* add a `ports.config.json` in the root dir (see below)
* run `npm start`
* open [localhost:3000](http://localhost:3000)


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

## research
* [Websockets](https://tttapa.github.io/ESP8266/Chap14%20-%20WebSocket.html)
* [Programming a standalone ESP8266](https://www.instructables.com/id/3-Simple-Ways-of-Programming-an-ESP8266-12X-Module/)
* [Deploying your JS App to Github Pages the easy way (or not)](https://medium.com/linagora-engineering/1ef8c48424b7)
* [SSL WebSockets for the Arduino currently not supported](https://github.com/gilmaimon/ArduinoWebsockets/issues/59) 
