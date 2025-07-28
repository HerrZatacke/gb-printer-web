## Uso de un dispositivo WebUSB o WebSerial:
Después de conectar un dispositivo WebUSB o WebSerial, ahora puedes continuar a la [página de galería](/gallery) o a la [página de inicio](/home).  
El icono USB pulsará cuando se reciban datos.  
También puedes acceder a las opciones a través del icono USB en la navegación y la [página de configuración](/settings).

## Nota: WebUSB y Web Serial son similares, pero no idénticos:
* Web Serial tiene acceso a un puerto COM normal y no requiere dispositivos especiales, pero no está disponible en dispositivos móviles.
* WebUSB requiere ciertos microcontroladores donde el procesador tiene acceso directo a la interfaz USB (por ejemplo, un Arduino Leonardo). Consulta [webusb for arduino en GitHub](https://github.com/webusb/arduino) para más información.

## Proyectos compatibles
Esta aplicación web de galería actualmente admite dos dispositivos serie especiales relacionados con la cámara GameBoy:
* Recepción de datos de tiles y paletas impresos desde un GameBoy físico a través del [Arduino Gameboy Printer Emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator/)
* Envío de datos de tiles para imprimir en una impresora GameBoy física a través del [Super Printer Interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/)

## Dispositivos recomendados (microcontroladores)
La mayoría de los Arduinos genéricos (por ejemplo, «Arduino Nano») deberían funcionar sin problemas en una PC de escritorio.  
Para poder comunicarse también con un dispositivo serie en smartphones Android, se necesita un dispositivo que haya sido programado con soporte WebUSB habilitado (por ejemplo, un «Arduino Leonardo» – también conocido como «Arduino Pro Micro»).  
Ni WebUSB ni WebSerial están disponibles si usas Firefox o un dispositivo iOS.
