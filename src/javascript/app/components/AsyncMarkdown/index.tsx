import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import type { Theme } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { MuiMarkdownProps } from 'mui-markdown';

interface Props {
  getMarkdown: () => Promise<string>;
}

function MarkdownStyledStack({ children }: PropsWithChildren) {
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
      })}
    >
      {children}
    </Stack>
  );
}

function AsyncMarkdown({ getMarkdown }: Props) {
  const [MuiMarkdown, setMuiMarkdown] = useState<FC<MuiMarkdownProps>>(() => () => null);
  const [docs, setDocs] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const { default: MMD } = await import(/* webpackChunkName: "mmd" */ 'mui-markdown');
      setMuiMarkdown(() => MMD);
      setDocs(await getMarkdown());
    };

    load();
  }, [getMarkdown]);

  return (
    <Card>
      <CardContent>
        <MuiMarkdown options={{ wrapper: MarkdownStyledStack }}>
          {docs}
        </MuiMarkdown>
      </CardContent>
    </Card>
  );
}

export default AsyncMarkdown;
