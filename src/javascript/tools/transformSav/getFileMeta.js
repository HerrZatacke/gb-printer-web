/* eslint-disable prefer-template */
import { charMapInt, charMapJp } from './charMap';

const convertToReadable = (data, cartIsJP) => {
  const values = [...data].filter(Boolean);
  const charMap = cartIsJP ? charMapJp : charMapInt;

  return values.map((value) => (
    charMap[value] || ''
  )).join('');
};

const parseGender = (byte) => {
  // eslint-disable-next-line no-bitwise
  if (byte & 0x01) {
    return 'm';
  }

  // eslint-disable-next-line no-bitwise
  if (byte & 0x02) {
    return 'f';
  }

  return '-';
};

const parseBloodType = (byte) => {
  // eslint-disable-next-line no-bitwise
  switch (byte & 0x1C) {
    case 0x04:
      return 'A';
    case 0x08:
      return 'B';
    case 0x0C:
      return '0';
    case 0x10:
      return 'AB';
    default:
      return '-';
  }
};

const getFileMeta = (data, baseAddress, cartIsJP) => {
  const cartIndex = (baseAddress / 0x1000) - 2;
  const albumIndex = cartIndex >= 0 ? data[0x11b2 + cartIndex] : 64;

  // For all adresses see:
  // https://funtography.online/wiki/Structure_of_the_Game_Boy_Camera_Save_Data

  // 0x00F04-0x00F0C: username (0x56 = A to 0xC8 = @, same tileset as first character stamps).
  const userName = data.slice(baseAddress + 0x00F04, baseAddress + 0x00F0C + 1);

  // 0x00F0D: User gender (0x00 no gender, 0x01 male, 0x00 female) and blood type (japanese only, +0x04 A, +0x08 B, +0x0C O, +0x10 AB).
  const genderAndBloodType = data[baseAddress + 0x00F0D];

  // 0x00F0E-0x00F11: Birthdate (year, 2x2 bytes, day, 2 bytes, month, 2 bytes, each 2 bytes + 11).
  const birthDate = data.slice(baseAddress + 0x00F0E, baseAddress + 0x00F11 + 1);

  // 0x00F15-0x00F2F: Contains comment (0x56 = A to 0xC8 = @, same tileset as first character stamps).
  const comment = data.slice(baseAddress + 0x00F15, baseAddress + 0x00F2F + 1);

  // 0x00F33: 0x00 if image is original, 0x01 if image is a copy.
  const isCopy = Boolean(data[baseAddress + 0x00F33]);

  // 0x00F54: border number associated to the image.
  const frameNumber = data[baseAddress + 0x00F54];


  return {
    cartIndex,
    albumIndex,
    baseAddress,
    meta: {
      birthDate: [...birthDate], // ToDo: Parse
      userName: convertToReadable(userName, cartIsJP),
      gender: parseGender(genderAndBloodType),
      bloodType: parseBloodType(genderAndBloodType),
      comment: convertToReadable(comment, cartIsJP),
      isCopy,
    },
    frameNumber,
  };
};

export default getFileMeta;
