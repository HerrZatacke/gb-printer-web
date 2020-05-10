# Gameboy Printer Web

## Setup
If you want this app to locally connect to an Arduino running the gbp-emulator you need to create a file `ports.config.json` and configure it accordingly (multiple ports are supported):
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
