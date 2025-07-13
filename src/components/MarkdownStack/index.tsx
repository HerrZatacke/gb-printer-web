'use client';

import Stack from '@mui/material/Stack';
import { Theme } from '@mui/system';
import type { PropsWithChildren } from 'react';

export default function MarkdownStack({ children }: PropsWithChildren) {
  return (
    <Stack
      direction="column"
      gap={1}
      sx={(theme: Theme) => ({
        a: {
          color: theme.palette.secondary.light,
          textDecorationColor: 'currentColor',

          '&:hover': {
            color: theme.palette.secondary.main,
          },
        },
        code: {
          fontFamily: 'monospace',
        },
        ul: {
          listStyleType: 'disc',
          paddingInlineStart: theme.spacing(2),
        },
        'h1,h2,h3,h4,h5,h6,p': {
          mb: '0.25em',
        },
        'h1,h2,h3,h4,h5,h6': {
          mt: '1.25em',
        },
        '& > :first-child': {
          mt: 0,
        },
      })}
    >
      {children}
    </Stack>
  );
}
