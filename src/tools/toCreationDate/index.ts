import dayjs from 'dayjs';
import { Date } from '@/tools/safeDate';

const FORMAT = 'YYYY-MM-DD HH:mm:ss:SSS';

export const fromCreationDate = (creationDate: string): Date => {
  const d = dayjs(creationDate, FORMAT, true); // strict = true: no loose fallback parsing

  if (!d.isValid()) {
    console.warn(`fromCreationDate received malformed creationDate "${creationDate}". Must be "${FORMAT}"`);
    return new Date(NaN);
  }

  return d.toDate();
};

// Outputs a date in YYYY-MM-DD HH:mm:ss:SSS format
export const toCreationDate = (date?: number | Date): string => {
  let creationDate: Date;

  switch(typeof date) {
    case 'number':
      creationDate = new Date(date);
      break;
    case 'undefined':
      creationDate = new Date();
      break;
    default:
      creationDate = date;
  }

  if (isNaN(creationDate.getTime())) {
    throw new Error(`toCreationDate received an invalid Date${typeof date === 'number' ? ` (input: ${date})` : ''}`);
  }

  const pad = (num: number, size = 2) => String(num).padStart(size, '0');

  return [
    creationDate.getFullYear(),
    '-',
    pad(creationDate.getMonth() + 1),
    '-',
    pad(creationDate.getDate()),
    ' ',
    pad(creationDate.getHours()),
    ':',
    pad(creationDate.getMinutes()),
    ':',
    pad(creationDate.getSeconds()),
    ':',
    pad(creationDate.getMilliseconds(), 3),
  ]
    .join('');
};
