
export const getSheetColumnRange = (columnIndex: number): string => {
  if (columnIndex < 0) {
    return 'A:A';
  }

  let column = '';
  columnIndex += 1; // Excel columns are 1-indexed

  while (columnIndex > 0) {
    const remainder = (columnIndex - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    columnIndex = Math.floor((columnIndex - 1) / 26);
  }

  return `${column}:${column}`;
};
