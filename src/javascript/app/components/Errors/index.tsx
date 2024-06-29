import React from 'react';
import { useErrors } from './useErrors';
import ErrorMessage from './ErrorMessage';

import './index.scss';

function Error() {

  const { errors, dismissError } = useErrors();

  return (
    <ul className="errors">
      { errors.map((errorMessage, index) => (
        <ErrorMessage
          key={`${errorMessage.timestamp}-${index}`}
          dismiss={() => dismissError(index)}
          errorMessage={errorMessage}
        />
      ))}
    </ul>
  );
}

export default Error;
