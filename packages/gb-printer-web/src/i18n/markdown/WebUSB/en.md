## Using a WebUSB or WebSerial device:
After connecting a WebUSB or WebSerial device, you can continue to the [Gallery Page](/gallery) or [Home Page](/) now.  
The USB-Symbol will pulse as soon as data is being received.    
You can also access these options via the USB-Symbol in the navigation and the [Settings Page](/settings).  

## Note: WebUSB and Web Serial are similar but not the same:
* While Web Serial has access to a regular COM-port and does not require special devices, the feature is not available on mobile devices.
* WebUSB requires certain microcontrollers where the processor has direct access to the USB interface (e.g. an Arduino Leonardo). See [webusb for arduino on GitHub](https://github.com/webusb/arduino) for more information.

## Supported Projects
This gallery web app currently supports two specific serial devices dedicated to the GameBoy Camera: 
* Receiving tiledata and captured packages printed from a physical GameBoy through the [Arduino Gameboy Printer Emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator/) 
* Sending tiledata to be printed on a physical GameBoy Printer through the [Super Printer Interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/)

## Recommended Devices (microcontrollers)
Most generic Arduinos (e.g. "Arduino Nano") should work without problems if you're working on a desktop PC.  
Being able to communicate with a serial device on Android phones as well, requires a device programmed with WebUSB enabled (e.g. an "Arduino Leonardo" - aka "Arduino Pro Micro").  
Neither WebUSB nor WebSerial is available when you're using Firefox or any iOS device. 
