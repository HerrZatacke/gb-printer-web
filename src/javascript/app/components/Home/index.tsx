import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { MuiMarkdownProps } from 'mui-markdown';

function GappedStack({ children }: PropsWithChildren) {
  return (
    <Stack
      direction="column"
      gap={4}
    >
      {children}
    </Stack>
  );
}

function Home() {
  const [MuiMarkdown, setMuiMarkdown] = useState<FC<MuiMarkdownProps>>(() => () => null);
  const [docs, setDocs] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const { default: MMD } = await import(/* webpackChunkName: "mmd" */ 'mui-markdown');
      setMuiMarkdown(() => MMD);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { default: rawMd } = await import(/* webpackChunkName: "doc" */ '../../../../../README.md');
      setDocs(rawMd);
    };

    load();
  }, []);

  return (
    <Card className="home">
      <CardContent>
        <MuiMarkdown options={{ wrapper: GappedStack }}>
          {docs}
        </MuiMarkdown>
      </CardContent>
    </Card>
  );
}

export default Home;
