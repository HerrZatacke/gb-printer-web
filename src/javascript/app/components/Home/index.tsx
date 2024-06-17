import React, { ReactElement, useEffect, useState } from 'react';
import type { ReactMarkdownOptions } from 'react-markdown';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import docs from '../../../../../README.md';

import './index.scss';

const X = () => <p />;

const Home = () => {

  const [ReactMarkdown, setReactMarkdown] = useState<(options: ReactMarkdownOptions) => ReactElement>(() => X);

  useEffect(() => {
    const load = async () => {
      const { default: MDComponent } = await import(/* webpackChunkName: "rmd" */ 'react-markdown');
      setReactMarkdown(() => MDComponent);
    };

    load();
  }, []);

  return (
    <div className="home">
      <ReactMarkdown className="markdown-body">
        {docs}
      </ReactMarkdown>
    </div>
  );
};

export default Home;
