import type { Theme } from '@mui/system';

export const getPreStyles = (theme: Theme, additionalStyles: object) => ({
  flexGrow: 0,
  flexShrink: 1,
  wordBreak: 'break-all',
  whiteSpace: 'no-wrap',
  overflow: 'hidden',
  width: '100%',
  borderRadius: '3px',
  ...additionalStyles,
});
