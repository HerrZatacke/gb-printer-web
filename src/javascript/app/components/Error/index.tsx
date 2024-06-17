import React from 'react';
import { useRouteError } from 'react-router-dom';

function Error() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <p>
        { (error as { statusText: string})?.statusText || (error as Error).message }
      </p>
      <pre>
        { (error as Error).stack }
      </pre>
    </div>
  );
}

export default Error;
