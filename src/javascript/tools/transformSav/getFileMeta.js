import { charMapInt, charMapJp, charMapDateDigit } from './charMap';
import parsePXLRMetadata from './parsePXLRMetadata';

const convertToReadable = (data, cartIsJP) => {
  const charMap = cartIsJP ? charMapJp : charMapInt;

  return [...data].map((value) => (
    charMap[value] || ' '
  )).join('').trim();
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

const convertDigit = (byteValue) => {
  if (!byteValue) {
    return '--';
  }

  // eslint-disable-next-line no-bitwise
  const upperFormat = charMapDateDigit[byteValue >> 4];
  // eslint-disable-next-line no-bitwise
  const lowerFormat = charMapDateDigit[byteValue & 0b00001111];
  return `${upperFormat}${lowerFormat}`;
};

const concatYear = (year1, year2) => {
  if (year1 === '--' && year2 !== '--') {
    return `00${year2}`;
  }

  if (year1 !== '--' && year2 === '--') {
    return `${year1}00`;
  }

  return `${year1}${year2}`;
};

const parseBirthDate = (birthDate, cartIsJP) => {
  const [year1, year2, date1, date2] = [...birthDate].map(convertDigit);

  const fullYear = concatYear(year1, year2);

  if (cartIsJP) {
    return `${fullYear}年${date1}月${date2}日`;
  }

  return `${date1}/${date2}/${fullYear}`;
};

const parseUserId = (userId, cartIsJP) => {
  const digits =
    [...userId]
      .map(convertDigit)
      .map((digit) => (digit === '--' ? '00' : digit));
  const prefix = cartIsJP ? 'PC-' : 'GC-';

  return `${prefix}${digits.join('')}`;
};

const getFileMeta = (data, baseAddress, cartIsJP) => {
  const cartIndex = (baseAddress / 0x1000) - 2;
  const albumIndex = cartIndex >= 0 ? data[0x11b2 + cartIndex] : 64;

  // For all adresses see:
  // https://funtography.online/wiki/Structure_of_the_Game_Boy_Camera_Save_Data

  // 0x02F00-0x02F03: user ID, 4 bytes sequence (equal to 11 + series of two digits among 8 in reading order).
  const userId = data.slice(baseAddress + 0x00F00, baseAddress + 0x00F03 + 1);

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

  // 0x00E00-0x00EFF: image thumbnail (32x32, 16 tiles, black borders and 4 white lines on the bottom to not hide the hand). Image exchanged displays a small distinctive badge.
  const thumbnail = data.slice(baseAddress + 0x00E00, baseAddress + 0x00EFF + 1);

  const pxlrMeta = albumIndex < 64 ? parsePXLRMetadata(thumbnail) : {};

  // if (albumIndex < 64) {
  //   console.log(albumIndex, pxlrMeta.exposure);
  // }

  return {
    cartIndex,
    albumIndex,
    baseAddress,
    meta: baseAddress ? {
      userId: parseUserId(userId, cartIsJP),
      birthDate: parseBirthDate(birthDate, cartIsJP),
      userName: convertToReadable(userName, cartIsJP),
      gender: parseGender(genderAndBloodType),
      bloodType: parseBloodType(genderAndBloodType),
      comment: convertToReadable(comment, cartIsJP),
      isCopy,
      ...pxlrMeta,
    } : null,
    frameNumber,
  };
};

export default getFileMeta;
