# [Galería de la cámara Game Boy](https://github.com/HerrZatacke/gb-printer-web)

La Galería de la cámara Game Boy es una aplicación web para organizar, editar y compartir fotos tomadas con la cámara Game Boy.

## [Galería](/gallery)
Ve y gestiona todas las fotos importadas en una galería interactiva:
- Etiquetar imágenes
- Combinar fotos en grupos de imágenes
- Filtrar tu colección
- Ver metadatos de estados de guardado de ROMs como [Photo!](https://github.com/untoxa/gb-photo) o la ROM original de Game Boy Camera
- Imprimir imágenes en una Game Boy Printer original usando dispositivos de comunicación serie

### Grupos de Imágenes
Puedes organizar imágenes relacionadas en grupos:
- Puedes crear grupos seleccionando múltiples imágenes y agrupándolas a través del menú contextual de una imagen seleccionada
- Los grupos pueden crearse automáticamente durante un proceso de importación o al generar imágenes RGB
- Puedes seleccionar imágenes para moverlas entre grupos sin necesariamente crear un nuevo grupo

## [Comunicación Serie](/webusb)
Conecta directamente con dispositivos de proyectos de la comunidad usando WebSerial:

### Impresión en una Game Boy Printer física
- Con WebSerial habilitado, imprime imágenes en una Game Boy Printer original usando el [Super Printer Interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/) de Raphaël Boichot

### Comunicación con Cartuchos
- Habilita WebSerial en Chrome para comunicarte directamente con el GBxCart (solo escritorio)
- Usa un lector de cartuchos con el firmware de Lesserkuma para cargar estados de guardado (ej. [GBxCart RW](https://www.gbxcart.com/), [JoeyJr](https://bennvenn.myshopify.com/products/usb-gb-c-cart-dumper-the-joey-jr), [GBFlash](https://github.com/simonkwng/GBFlash))

### Emuladores de Game Boy Printer
Conecta un emulador de impresora a través de WebSerial para imprimir desde tu Game Boy Camera directamente a la WebApp:
- [arduino-gameboy-printer-emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator) – Emulador basado en Arduino por mofosyne
- [pico-gb-printer](https://github.com/untoxa/pico-gb-printer/) – Implementación para Raspberry Pi Pico por untoxa
- [NeoGB-Printer](https://github.com/zenaror/NeoGB-Printer) – Implementación para Arduino Nano por Rafael Zenaro
- [wifi-gbp-emulator](https://github.com/HerrZatacke/wifi-gbp-emulator) – Emulador WiFi ESP8266 con servidor web integrado que puede alojar esta webapp

## [Importar](/import)
Importa imágenes de múltiples fuentes mediante arrastrar y soltar:
- Estados de guardado de cartuchos (dumps `.sav` incluyendo la versión de 1MB de [FlashGBX](https://github.com/lesserkuma/FlashGBX))
- Registros serie hexadecimales de Game Boy Printer
- Archivos de bitmap de proyectos que solo generan imágenes básicas

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
- «Average» – Crear imágenes compuestas de múltiples fotos (estilo HDR)
- «Custom Pixels» – Reemplazar píxeles individuales con representaciones detalladas

## [Sincronización Dropbox](/settings/dropbox)
Mantén tu galería sincronizada entre dispositivos. Habilita Dropbox y podrás sincronizar tu biblioteca.
