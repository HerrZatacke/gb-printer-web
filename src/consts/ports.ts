export enum PortType {
  USB = 'USB',
  SERIAL = 'SERIAL',
}

export enum PortDeviceType {
  UNKNOWN = 'unknown', // While detecting headers
  INACTIVE = 'inactive', // Could not be identified, set to be inactive
  PACKET_CAPTURE = 'packet_capture',
  SUPER_PRINTER_INTERFACE = 'super_printer_interface',
  GBXCART = 'gbxcart',
}

export const portDeviceLabels: Record<PortDeviceType, string> = {
  [PortDeviceType.UNKNOWN]: 'Unknown Device',
  [PortDeviceType.INACTIVE]: 'Inactive Device',
  [PortDeviceType.PACKET_CAPTURE]: 'Arduino Gameboy Printer Emulator',
  [PortDeviceType.SUPER_PRINTER_INTERFACE]: 'Super Printer Interface',
  [PortDeviceType.GBXCART]: 'GBxCart RW',
};

export const usbDeviceFilters: USBDeviceFilter[] = [
  { vendorId: 0x2341, productId: 0x8036 }, // Arduino Leonardo
  { vendorId: 0x2341, productId: 0x8037 }, // Arduino Micro
  { vendorId: 0x2341, productId: 0x804d }, // Arduino/Genuino Zero
  { vendorId: 0x2341, productId: 0x804e }, // Arduino/Genuino MKR1000
  { vendorId: 0x2341, productId: 0x804f }, // Arduino MKRZERO
  { vendorId: 0x2341, productId: 0x8050 }, // Arduino MKR FOX 1200
  { vendorId: 0x2341, productId: 0x8052 }, // Arduino MKR GSM 1400
  { vendorId: 0x2341, productId: 0x8053 }, // Arduino MKR WAN 1300
  { vendorId: 0x2341, productId: 0x8054 }, // Arduino MKR WiFi 1010
  { vendorId: 0x2341, productId: 0x8055 }, // Arduino MKR NB 1500
  { vendorId: 0x2341, productId: 0x8056 }, // Arduino MKR Vidor 4000
  { vendorId: 0x2341, productId: 0x8057 }, // Arduino NANO 33 IoT
  { vendorId: 0x239A }, // Adafruit Boards!
  { vendorId: 0x0483, productId: 0x5740 }, // JoeyJR?

  // CH340 devices (GBXCart) seem to be blocked by chrome
  // { vendorId: 0x1a86, productId: 0x7523 },
];
