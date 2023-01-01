import React, { useEffect, useState } from 'react';
import docs from '../../../../../README.md';
import './index.scss';

const Home = () => {

  const [ReactMarkdown, setReactMarkdown] = useState(() => () => null);

  useEffect(() => {
    import(/* webpackChunkName: "rmd" */ 'react-markdown')
      .then(({ default: MDComponent }) => {
        setReactMarkdown(() => MDComponent);
      });
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
