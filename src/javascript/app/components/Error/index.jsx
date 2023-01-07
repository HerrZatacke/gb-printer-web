import React from 'react';
import { useRouteError } from 'react-router-dom';

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <p>
        {error.statusText || error.message}
      </p>
      <pre>
        { error.stack }
      </pre>
    </div>
  );
};

export default Error;
