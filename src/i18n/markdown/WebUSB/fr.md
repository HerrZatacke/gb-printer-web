## Utilisation d'un dispositif WebUSB ou WebSerial :
Après avoir connecté un dispositif WebUSB ou WebSerial, vous pouvez maintenant continuer vers la [Page Galerie](/gallery) ou la [Page d'Accueil](/).  
Le symbole USB pulsera dès que des données seront reçues.    
Vous pouvez également accéder à ces options via le symbole USB dans la navigation et la [Page Paramètres](/settings).  

## Note : WebUSB et Web Serial sont similaires mais pas identiques :
* Bien que Web Serial ait accès à un port COM standard et ne nécessite pas de dispositifs spéciaux, cette fonctionnalité n'est pas disponible sur les appareils mobiles.
* WebUSB nécessite certains microcontrôleurs où le processeur a un accès direct à l'interface USB (par ex. un Arduino Leonardo). Voir [webusb for arduino sur GitHub](https://github.com/webusb/arduino) pour plus d'informations.

## Projets Supportés
Cette application web de galerie supporte actuellement deux dispositifs série spécifiques dédiés à la GameBoy Camera : 
* Réception de données de tuiles et de paquets capturés imprimés depuis une GameBoy physique via l'[Arduino Gameboy Printer Emulator](https://github.com/mofosyne/arduino-gameboy-printer-emulator/) 
* Envoi de données de tuiles à imprimer sur une GameBoy Printer physique via l'[Interface Super Printer](https://github.com/Raphael-Boichot/Yet-another-PC-to-Game-Boy-Printer-interface/)

## Dispositifs Recommandés (microcontrôleurs)
La plupart des Arduinos génériques (par ex. "Arduino Nano") devraient fonctionner sans problème si vous travaillez sur un PC de bureau.  
Pour pouvoir communiquer avec un dispositif série sur les téléphones Android également, il faut un dispositif programmé avec WebUSB activé (par ex. un "Arduino Leonardo" - alias "Arduino Pro Micro").  
Ni WebUSB ni WebSerial ne sont disponibles lorsque vous utilisez Firefox ou tout appareil iOS.
