
interface GBXCartDeviceVar {
  size: number,
  value: number,
}

// https://github.com/Mraulio/GBCamera-Android-Manager/blob/main/app/src/main/java/com/mraulio/gbcameramanager/gbxcart/GBxCartCommands.java

export const GBXCartCommands: Record<string, number> = {
  'NULL': 0x30,
  'OFW_RESET_AVR': 0x2A,
  'OFW_CART_MODE': 0x43,
  'OFW_FW_VER': 0x56,
  'OFW_PCB_VER': 0x68,
  'OFW_USART_1_7M_SPEED': 0x3E,
  'OFW_CART_PWR_ON': 0x2F,
  'OFW_CART_PWR_OFF': 0x2E,
  'OFW_QUERY_CART_PWR': 0x5D,
  'OFW_DONE_LED_ON': 0x3D,
  'OFW_ERROR_LED_ON': 0x3F,
  'OFW_GB_CART_MODE': 0x47,
  'OFW_GB_FLASH_BANK_1_COMMAND_WRITES': 0x4E,
  'OFW_LNL_QUERY': 0x25,
  'QUERY_FW_INFO': 0xA1,
  'SET_MODE_AGB': 0xA2,
  'SET_MODE_DMG': 0xA3,
  'SET_VOLTAGE_3_3V': 0xA4,
  'SET_VOLTAGE_5V': 0xA5,
  'CART_PWR_ON': 0xF2,
  'SET_VARIABLE': 0xA6,
  'SET_FLASH_CMD': 0xA7,
  'SET_ADDR_AS_INPUTS': 0xA8,
  'CLK_HIGH': 0xA9,
  'CLK_LOW': 0xAA,
  'DMG_CART_READ': 0xB1,
  'DMG_CART_WRITE': 0xB2,
  'DMG_CART_WRITE_SRAM': 0xB3,
  'DMG_MBC_RESET': 0xB4,
  'DMG_MBC7_READ_EEPROM': 0xB5,
  'DMG_MBC7_WRITE_EEPROM': 0xB6,
  'DMG_MBC6_MMSA_WRITE_FLASH': 0xB7,
  'DMG_SET_BANK_CHANGE_CMD': 0xB8,
  'DMG_EEPROM_WRITE': 0xB9,
  'AGB_CART_READ': 0xC1,
  'AGB_CART_WRITE': 0xC2,
  'AGB_CART_READ_SRAM': 0xC3,
  'AGB_CART_WRITE_SRAM': 0xC4,
  'AGB_CART_READ_EEPROM': 0xC5,
  'AGB_CART_WRITE_EEPROM': 0xC6,
  'AGB_CART_WRITE_FLASH_DATA': 0xC7,
  'AGB_CART_READ_3D_MEMORY': 0xC8,
  'AGB_BOOTUP_SEQUENCE': 0xC9,
  'DMG_FLASH_WRITE_BYTE': 0xD1,
  'AGB_FLASH_WRITE_SHORT': 0xD2,
  'FLASH_PROGRAM': 0xD3,
  'CART_WRITE_FLASH_CMD': 0xD4,
};


export const GBXCartDeviceVars: Record<string, GBXCartDeviceVar> = {
  'ADDRESS': { size: 4, value: 0x00 },
  'TRANSFER_SIZE': { size: 2, value: 0x00 },
  'BUFFER_SIZE': { size: 2, value: 0x01 },
  'DMG_ROM_BANK': { size: 2, value: 0x02 },
  'CART_MODE': { size: 1, value: 0x00 },
  'DMG_ACCESS_MODE': { size: 1, value: 0x01 },
  'FLASH_COMMAND_SET': { size: 1, value: 0x02 },
  'FLASH_METHOD': { size: 1, value: 0x03 },
  'FLASH_WE_PIN': { size: 1, value: 0x04 },
  'FLASH_PULSE_RESET': { size: 1, value: 0x05 },
  'FLASH_COMMANDS_BANK_1': { size: 1, value: 0x06 },
  'FLASH_SHARP_VERIFY_SR': { size: 1, value: 0x07 },
  'DMG_READ_CS_PULSE': { size: 1, value: 0x08 },
  'DMG_WRITE_CS_PULSE': { size: 1, value: 0x09 },
  'FLASH_DOUBLE_DIE': { size: 1, value: 0x0A },
  'DMG_READ_METHOD': { size: 1, value: 0x0B },
  'AGB_READ_METHOD': { size: 1, value: 0x0C },
};


export const GBXCartPCBVersions: Record<number, string> = {
  4: 'v1.3',
  5: 'v1.4',
  6: 'v1.4a',
  101: 'Mini v1.0d',
};

export const GBXCartJoeyPCBVersions: Record<number, string> = {
  0x01: 'V2',
  0x81: 'V2',
  0x02: 'V2C',
  0x82: 'V2C',
  0x03: 'V2CC',
  0x83: 'V2CC/V2++',
};

export const GBXCartGBFlashPCBVersions: Record<number, string> = {
  12: 'v1.2',
  13:'v1.3',
};
