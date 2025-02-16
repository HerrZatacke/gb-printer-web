export enum FileNameStyle {
  FULL = 'FULL',
  TITLE_ONLY = 'TITLE_ONLY',
  DATE_TITLE = 'DATE_TITLE',
}

interface FileNameStyleLabel {
  id: FileNameStyle,
  name: string,
}

export const fileNameStyleLabels: FileNameStyleLabel[] = [
  {
    id: FileNameStyle.FULL,
    name: 'Full Title',
  },
  {
    id: FileNameStyle.DATE_TITLE,
    name: 'Date and Title',
  },
  {
    id: FileNameStyle.TITLE_ONLY,
    name: 'Title only',
  },
];
