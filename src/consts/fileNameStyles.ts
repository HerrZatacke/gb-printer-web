export const FileNameStyle = {
  FULL: 'FULL',
  TITLE_ONLY: 'TITLE_ONLY',
  DATE_TITLE: 'DATE_TITLE',
} as const;
export type FileNameStyle = (typeof FileNameStyle)[keyof typeof FileNameStyle];

interface FileNameStyleLabel {
  id: FileNameStyle;
  name: string;
}

export const fileNameStyleLabels: FileNameStyleLabel[] = [
  {
    id: FileNameStyle.FULL,
    name: 'filenameStyles.fullTitle',
  },
  {
    id: FileNameStyle.DATE_TITLE,
    name: 'filenameStyles.dateTitle',
  },
  {
    id: FileNameStyle.TITLE_ONLY,
    name: 'filenameStyles.titleOnly',
  },
];
