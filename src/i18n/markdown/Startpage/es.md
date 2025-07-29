# [Galería de la cámara Game Boy](https://github.com/HerrZatacke/gb-printer-web)

La Galería de la cámara Game Boy es una aplicación web para organizar, editar y compartir fotos tomadas con la cámara Game Boy.

## [Importar](/import)
Importa imágenes desde múltiples fuentes mediante arrastrar y soltar:
- Estados de guardado de cartuchos (dumps `.sav` incluyendo la versión de 1MB de [FlashGBX](https://github.com/lesserkuma/FlashGBX))
  - Habilita [WebSerial](/webusb) en Chrome para comunicarte directamente con el GBxCart (solo escritorio)
  - Usa un dispositivo con el firmware de [Lesserkuma](https://github.com/lesserkuma) para varios dispositivos (ej. [GBxCart RW](https://www.gbxcart.com/), [JoeyJr](https://bennvenn.myshopify.com/products/usb-gb-c-cart-dumper-the-joey-jr), [GBFlash](https://github.com/simonkwng/GBFlash))
- Registros hex seriales de Game Boy Printer
  - Conecta un emulador de impresora a través de WebSerial para imprimir directamente desde tu cámara Game Boy
- Bitmaps simples
  - Archivos bitmap directos de proyectos que solo generan imágenes básicas
- Exportaciones de varios proyectos de microcontroladores de la comunidad:
  - [arduino-gameboy-printer-emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator) - Emulador basado en Arduino por mofosyne
  - [pico-gb-printer](https://github.com/untoxa/pico-gb-printer/) - Implementación para Raspberry Pi Pico por untoxa
  - [NeoGB-Printer](https://github.com/zenaror/NeoGB-Printer) - Implementación para Arduino Nano por Rafael Zenaro
  - [wifi-gbp-emulator](https://github.com/HerrZatacke/wifi-gbp-emulator) - Emulador WiFi ESP8266 con servidor web integrado que puede alojar esta webapp

## [Galería](/gallery)
Explora todas las fotos importadas en una galería responsiva:
- Etiquetar imágenes
- Combinar fotos en grupos de imágenes
- Filtrar tu colección
- Ver metadatos de ROMs compatibles como [Photo!](https://github.com/untoxa/gb-photo) o incluso la información básica de la ROM original de la cámara Game Boy
- Con [WebSerial](/webusb) habilitado, imprime imágenes en una Game Boy Printer original usando la [Super Printer Interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/) por Raphaël Boichot

## [Marcos](/frames)
Añadir, editar y compartir marcos de la cámara Game Boy:
- Arrastra una imagen (preferiblemente 160 × 144) para crear un nuevo marco o generar marcos durante la importación desde cualquier fuente de datos
- Importar/exportar paquetes completos de marcos como JSON para compartir con otros

## [Paletas](/palettes)
Trabajar con paletas de colores:
- Elegir entre paletas integradas
- Diseñar paletas personalizadas
- Extraer colores de fotografías normales para crear nuevas paletas
- Importar/exportar paletas como JSON para compartir con otros

## [Complementos](/settings/plugins)
Amplía la caja de herramientas con complementos de la comunidad:
- «Average» - Crear imágenes compuestas de múltiples fotos (estilo HDR)
- «Custom Pixels» - Reemplazar píxeles individuales con representaciones detalladas

## [Sincronización Dropbox](/settings/dropbox)
Mantén tu galería sincronizada entre dispositivos. Habilita Dropbox y podrás sincronizar tu biblioteca.
