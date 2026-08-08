const chars: Record<string, string> = {
  '': '006666666600FFFF',
  ' ': 'FFFFFFFFFFFFFFFF',
  '0': 'FFDDAAAAAADDFFFF',
  '1': 'FFDD99DDDDDDFFFF',
  '2': 'FF99EEDDBB88FFFF',
  '3': 'FF99EE99EE99FFFF',
  '4': 'FFDDBBBB88EEFFFF',
  '5': 'FF88BB99EE99FFFF',
  '6': 'FFCCBB99AADDFFFF',
  '7': 'FF88EEDDBBBBFFFF',
  '8': 'FFDDAADDAADDFFFF',
  '9': 'FFDDAACCEE99FFFF',
  'a': 'FFDDAAAA88AAFFFF',
  'b': 'FF99AA99AA99FFFF',
  'c': 'FFCCBBBBBBCCFFFF',
  'd': 'FF99AAAAAA99FFFF',
  'e': 'FF88BB99BB88FFFF',
  'f': 'FF88BB99BBBBFFFF',
  'g': 'FFCCBBAAAACCFFFF',
  'h': 'FFAAAA88AAAAFFFF',
  'i': 'FF88DDDDDD88FFFF',
  'j': 'FF99DDDDDDBBFFFF',
  'k': 'FFAAAA99AAAAFFFF',
  'l': 'FFBBBBBBBB88FFFF',
  'm': 'FFAA888AAAAAFFFF',
  'n': 'FFAA8A888AAAFFFF',
  'o': 'FFDDAAAAAADDFFFF',
  'p': 'FF99AA99BBBBFFFF',
  'q': 'FFDDAAAAAACCFFFF',
  'r': 'FF99AA99AAAAFFFF',
  's': 'FFCCBBDDEE99FFFF',
  't': 'FF88DDDDDDDDFFFF',
  'u': 'FFAAAAAAAACCFFFF',
  'v': 'FFAAAAAAAADDFFFF',
  'w': 'FFAAAA8A88AAFFFF',
  'x': 'FFAAAADDAAAAFFFF',
  'y': 'FFAAAADDDDDDFFFF',
  'z': 'FF88EEDDBB88FFFF',
  'ä': 'AADDAAAA88AAFFFF',
  'ö': 'AADDAAAAAADDFFFF',
  'ü': 'AAAFAAAAAACCFFFF',
  'ß': 'FF99AA99AA99BBFF',
  '.': 'FFFFFFFFFFDDFFFF',
  '!': 'DDDDDDDDFFDDFFFF',
  '?': 'DDAAEEDDFFDDFFFF',
  '-': 'FFFFFF88FFFFFFFF',
  '_': 'FFFFFFFFFF88FFFF',
  ':': 'FFFFDDFFDDFFFFFF',
};

const getChars = (text: string | number): string => {

  // convert to array of strings if necessary
  const textParts = [...text.toString(10).toLowerCase().split(''), ' ', ' '];

  const leftChar = textParts.shift() || '';
  const rightChar = textParts.shift() || '';

  const leftHex = chars[leftChar] || chars[''];
  const rightHex = chars[rightChar] || chars[''];

  return [...Array(16)]
    .map((_, index) => (
      `${leftHex[index]}${rightHex[index]}`
    )).join('');
};

export default getChars;
