
// Outputs a date in YYYY-MM-DD HH:mm:ss:SSS format
export const toCreationDate = (date?: number | string | Date): string => {
  const creationDate = date ? new Date(date) : new Date();

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
