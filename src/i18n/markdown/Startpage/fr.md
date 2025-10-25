# [Galerie Game Boy Camera](https://github.com/HerrZatacke/gb-printer-web)

La Galerie Game Boy Camera est une application web pour organiser, éditer et partager les photos prises avec la Game Boy Camera.

## [Galerie](/gallery)
Visualisez et gérez toutes les photos importées dans une galerie intéractive :
- Étiquetez les images
- Combinez les photos en groupes d'images
- Filtrez votre collection
- Visualisez les métadonnées des savestates de ROMs comme [Photo!](https://github.com/untoxa/gb-photo) ou la ROM originale de la Game Boy Camera
- Imprimez les images sur une Game Boy Printer originale en utilisant des périphériques de communication série

### Groupes d'Images
Organisez les images liées ensemble en groupes :
- Créez des groupes en sélectionnant plusieurs images et en les regroupant via le menu contextuel d'une image sélectionnée
- Les groupes peuvent être créés automatiquement pendant un processus d'importation ou lors de la génération d'images RGB
- Sélectionnez des images pour les déplacer entre les groupes sans nécessairement créer un nouveau groupe

## [Communication Série](/webusb)
Connectez-vous directement aux périphériques de projets communautaires en utilisant WebSerial :

### Impression sur une Game Boy Printer physique
- Avec WebSerial activé, imprimez des images sur une Game Boy Printer originale en utilisant l'[interface Super Printer](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/) par Raphaël Boichot

### Communication avec Cartouche
- Activez WebSerial dans Chrome pour communiquer directement avec le GBxCart (ordinateur de bureau uniquement)
- Utilisez un lecteur de cartouche avec le firmware de Lesserkuma pour charger les savestates (par ex. [GBxCart RW](https://www.gbxcart.com/), [JoeyJr](https://bennvenn.myshopify.com/products/usb-gb-c-cart-dumper-the-joey-jr), [GBFlash](https://github.com/simonkwng/GBFlash))

### Émulateurs de Game Boy Printer
Connectez un émulateur d'imprimante via WebSerial pour imprimer depuis votre Game Boy Camera directement vers l'application web :
- [arduino-gameboy-printer-emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator) – Émulateur basé sur Arduino par mofosyne
- [pico-gb-printer](https://github.com/untoxa/pico-gb-printer/) – Implémentation Raspberry Pi Pico par untoxa
- [NeoGB-Printer](https://github.com/zenaror/NeoGB-Printer) – Implémentation Arduino Nano par Rafael Zenaro
- [wifi-gbp-emulator](https://github.com/HerrZatacke/wifi-gbp-emulator) – Émulateur WiFi ESP8266 avec serveur web intégré qui peut héberger cette webapp

## [Import](/import)
Importez des images depuis plusieurs sources par glisser-déposer :
- Savestates de cartouche (dumps `.sav` incluant la version 1MB de [FlashGBX](https://github.com/lesserkuma/FlashGBX))
- Logs hex série de Game Boy Printer
- Fichiers bitmap de projets qui ne produisent que des images de base

## [Cadres](/frames)
Ajoutez, éditez et partagez des cadres de Game Boy Camera :
- Déposez une image (de préférence 160 × 144) pour créer un nouveau cadre ou générez des cadres pendant l'importation depuis n'importe quelle source de données
- Importez/exportez des packs de cadres complets en JSON pour les partager avec d'autres

## [Palettes](/palettes)
Travaillez avec des palettes de couleurs :
- Choisissez parmi les palettes intégrées
- Concevez des palettes personnalisées
- Extrayez des couleurs de photographies ordinaires pour créer de nouvelles palettes
- Importez/exportez des palettes en JSON pour les partager avec d'autres

## [Plugins](/settings/plugins)
Étendez la boîte à outils avec des plug-ins communautaires :
- « Average » – Créez des images composites à partir de plusieurs prises (style HDR)
- « Custom Pixels » – Remplacez des pixels individuels par des représentations détaillées

## [Synchronisation Dropbox](/settings/dropbox)
Gardez votre galerie synchronisée sur tous vos appareils. Activez Dropbox et vous pourrez synchroniser votre bibliothèque.
