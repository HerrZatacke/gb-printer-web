import React from 'react';
import AsyncMarkdown from '../AsyncMarkdown';

function Home() {
  return (
    <AsyncMarkdown
      getMarkdown={async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { default: rawMd } = await import(/* webpackChunkName: "doc" */ '../../../../../README.md');
        return rawMd;
      }}
    />
  );
}

export default Home;
