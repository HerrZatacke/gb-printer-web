# [Game Boy Camera Gallery](https://github.com/HerrZatacke/gb-printer-web)

Game Boy Camera Gallery è un'app web per organizzare, modificare e condividere scatti realizzati con la Game Boy Camera.

## [Galleria](/gallery)
Visualizza e gestisci tutti gli scatti importati in una galleria interattiva:
- Tagga le immagini
- Combina scatti in gruppi di immagini
- Filtra la tua collezione
- Visualizza i metadati dai salvataggi di ROM come [Photo!](https://github.com/untoxa/gb-photo) o dalla ROM originale della Game Boy Camera
- Stampa le immagini su una Game Boy Printer originale usando dispositivi di comunicazione seriale

### Gruppi di Immagini
Organizza immagini correlate in gruppi:
- Crea gruppi selezionando più immagini e raggruppandole tramite il menu contestuale di un'immagine selezionata
- I gruppi possono essere creati automaticamente durante il processo di importazione o quando si generano immagini RGB
- Seleziona immagini per spostarle tra gruppi senza necessariamente crearne uno nuovo

## [Comunicazione Seriale](/webusb)
Collegati direttamente ai dispositivi di progetti della community usando WebSerial:

### Stampa su una Game Boy Printer fisica
- Con WebSerial abilitato, stampa immagini su una Game Boy Printer originale usando [Super Printer interface](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/) di Raphaël Boichot

### Comunicazione con la Cartuccia
- Abilita WebSerial in Chrome per comunicare direttamente con GBxCart (solo desktop)
- Usa un lettore di cartucce con il firmware di Lesserkuma per caricare salvataggi (es. [GBxCart RW](https://www.gbxcart.com/), [JoeyJr](https://bennvenn.myshopify.com/products/usb-gb-c-cart-dumper-the-joey-jr), [GBFlash](https://github.com/simonkwng/GBFlash))

### Emulatori Game Boy Printer
Collega un emulatore di stampante tramite WebSerial per stampare dalla tua Game Boy Camera direttamente sull'app web:
- [arduino-gameboy-printer-emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator) – Emulatore basato su Arduino di mofosyne
- [pico-gb-printer](https://github.com/untoxa/pico-gb-printer/) – Implementazione Raspberry Pi Pico di untoxa
- [NeoGB-Printer](https://github.com/zenaror/NeoGB-Printer) – Implementazione Arduino Nano di Rafael Zenaro
- [wifi-gbp-emulator](https://github.com/HerrZatacke/wifi-gbp-emulator) – Emulatore WiFi ESP8266 con server web integrato che può ospitare questa webapp

## [Importa](/import)
Importa immagini da diverse fonti tramite Drag-and-drop:
- Salvataggi di cartucce (`.sav` inclusi i dump da 1MB di [FlashGBX](https://github.com/lesserkuma/FlashGBX))
- Log esadecimali seriali della Game Boy Printer
- File bitmap da progetti che producono solo immagini di base

## [Cornici](/frames)
Aggiungi, modifica e condividi cornici per Game Boy Camera:
- Trascina un'immagine (preferibilmente 160 × 144) per creare una nuova cornice o genera cornici durante l'importazione da qualsiasi fonte dati
- Importa/esporta pacchetti completi di cornici come JSON per condividerli con altri

## [Palette](/palettes)
Lavora con le palette di colori:
- Scegli tra le palette integrate
- Progetta palette personalizzate
- Estrai colori da fotografie normali per creare nuove palette
- Importa/esporta palette come JSON per condividerle con altri

## [Plugin](/settings/plugins)
Estendi la toolbox con plugin della community:
- «Average» – Crea immagini composite da più scatti (stile HDR)
- «Custom Pixels» – Sostituisci pixel individuali con rappresentazioni dettagliate

## [Sincronizzazione Dropbox](/settings/dropbox)
Tieni la tua galleria sincronizzata su più dispositivi. Attiva Dropbox per sincronizzare la tua libreria.
