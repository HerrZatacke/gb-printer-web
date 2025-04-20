import React from 'react';
import AsyncMarkdown from '../AsyncMarkdown';

function Home() {
  return (
    <AsyncMarkdown
      getMarkdown={async (): Promise<string> => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { default: rawMd } = await import(/* webpackChunkName: "doc" */ '../../../../../README.md');
        return rawMd.split('\n').slice(1).join('\n');
      }}
    />
  );
}

export default Home;
