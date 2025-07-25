import type { BasicMetaData, FileMetaData, ImageMetaData, RomTypes } from '@/types/transformSav';
import { charMapInt, charMapJp, charMapDateDigit } from './charMap';
import { getRomType, parseCustomMetadata } from './parseCustomMetadata';

const convertToReadable = (data: Uint8Array, cartIsJP: boolean): string => {
  const charMap = cartIsJP ? charMapJp : charMapInt;

  return [...data].map((value) => (
    charMap[value] || ' '
  )).join('').trim();
};

const parseGender = (byte: number): string => {
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

const parseBloodType = (byte: number): string => {
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

const convertDigit = (byteValue: number): string => {
  if (!byteValue) {
    return '--';
  }

  // eslint-disable-next-line no-bitwise
  const upperFormat = charMapDateDigit[byteValue >> 4];
  // eslint-disable-next-line no-bitwise
  const lowerFormat = charMapDateDigit[byteValue & 0b00001111];
  return `${upperFormat}${lowerFormat}`;
};

const concatYear = (year1: string, year2: string): string => {
  if (year1 === '--' && year2 !== '--') {
    return `00${year2}`;
  }

  if (year1 !== '--' && year2 === '--') {
    return `${year1}00`;
  }

  return `${year1}${year2}`;
};

const parseBirthDate = (birthDate: Uint8Array, cartIsJP: boolean): string => {
  const [year1, year2, date1, date2] = [...birthDate].map(convertDigit);

  const fullYear = concatYear(year1, year2);

  if (cartIsJP) {
    return `${fullYear}年${date1}月${date2}日`;
  }

  return `${date1}/${date2}/${fullYear}`;
};

const parseUserId = (userId: Uint8Array, cartIsJP: boolean): string => {
  const digits =
    [...userId]
      .map(convertDigit)
      .map((digit) => (digit === '--' ? '00' : digit));
  const prefix = cartIsJP ? 'PC-' : 'GC-';

  return `${prefix}${digits.join('')}`;
};

const parseBasicMetadata = (data: Uint8Array, baseAddress: number, cartIsJP: boolean): BasicMetaData => {
  // For all adresses see:
  // https://funtography.online/wiki/Structure_of_the_Game_Boy_Camera_Save_Data

  // 0x02F00-0x02F03: user ID, 4 bytes sequence (equal to 11 + series of two digits among 8 in reading order).
  const userId = data.subarray(baseAddress + 0x00F00, baseAddress + 0x00F03 + 1);

  // 0x00F04-0x00F0C: username (0x56 = A to 0xC8 = @, same tileset as first character stamps).
  const userName = data.subarray(baseAddress + 0x00F04, baseAddress + 0x00F0C + 1);

  // 0x00F0D: User gender (0x00 no gender, 0x01 male, 0x00 female) and blood type (japanese only, +0x04 A, +0x08 B, +0x0C O, +0x10 AB).
  const genderAndBloodType = data[baseAddress + 0x00F0D];

  // 0x00F0E-0x00F11: Birthdate (year, 2x2 bytes, day, 2 bytes, month, 2 bytes, each 2 bytes + 11).
  const birthDate = data.subarray(baseAddress + 0x00F0E, baseAddress + 0x00F11 + 1);

  // 0x00F15-0x00F2F: Contains comment (0x56 = A to 0xC8 = @, same tileset as first character stamps).
  const comment = data.subarray(baseAddress + 0x00F15, baseAddress + 0x00F2F + 1);

  // 0x00F33: 0x00 if image is original, 0x01 if image is a copy.
  const isCopy = Boolean(data[baseAddress + 0x00F33]);

  return {
    userId: parseUserId(userId, cartIsJP),
    birthDate: parseBirthDate(birthDate, cartIsJP),
    userName: convertToReadable(userName, cartIsJP),
    gender: parseGender(genderAndBloodType),
    bloodType: parseBloodType(genderAndBloodType),
    comment: convertToReadable(comment, cartIsJP),
    isCopy,
  };
};

// const describeAlbumIndex = (albumIndex: number): string => {
//   switch (albumIndex) {
//     case 64:
//       return 'last seen';
//     case 255:
//       return 'deleted';
//     default:
//       return albumIndex.toString(10);
//   }
// };

const getFileMeta = (data: Uint8Array, baseAddress: number, cartIsJP: boolean): FileMetaData => {
  const inBankAddress = (baseAddress % 0x20000);
  const bankIndex = Math.floor(baseAddress / 0x20000);
  const bankStartAddress = bankIndex * 0x20000;
  const cartIndex = (inBankAddress / 0x1000) - 2;
  const albumIndex = cartIndex >= 0 ? (data[bankStartAddress + 0x11b2 + cartIndex] + (bankIndex * 30)) : -1;

  // 0x00F54: border number associated to the image.
  const frameNumber = data[baseAddress + 0x00F54];

  // 0x00E00-0x00EFF: image thumbnail (32x32, 16 tiles, black borders and 4 white lines on the bottom to not hide the hand). Image exchanged displays a small distinctive badge.
  const thumbnail = data.slice(baseAddress + 0x00E00, baseAddress + 0x00EFF + 1);


  let meta: ImageMetaData | undefined;

  // not deleted or last seen
  if (albumIndex !== -1) {
    const romType: RomTypes = getRomType(thumbnail);
    // console.log(`albumIndex: ${describeAlbumIndex(albumIndex)} - ${romType}`);

    meta = { romType };

    if (romType !== 'stock') {
      meta = {
        ...meta,
        ...parseCustomMetadata(thumbnail, romType),
      };
    }

    if (romType === 'stock') { // ToDo: later support Photo! once userdata is implemented
      meta = {
        ...meta,
        ...parseBasicMetadata(data, baseAddress, cartIsJP),
      };
    }
  // } else {
  //   console.log(`albumIndex: ${describeAlbumIndex(albumIndex)}`);
  }

  return {
    cartIndex,
    albumIndex,
    baseAddress,
    frameNumber,
    meta,
  };
};

export default getFileMeta;
