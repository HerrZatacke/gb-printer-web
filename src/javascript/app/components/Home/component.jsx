import React, { useEffect, useState } from 'react';
import docs from '../../../../../README.md';

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
      <ReactMarkdown className="markdown-body" source={docs} />
    </div>
  );
};

export default Home;
