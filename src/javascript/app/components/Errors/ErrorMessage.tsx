import React, { useState } from 'react';
import SVG from '../SVG';
import type { ErrorMessage } from './useErrors';

interface Props {
  dismiss: () => void,
  errorMessage: ErrorMessage,
}

function Error({ dismiss, errorMessage }: Props) {
  const [showStack, setShowStack] = useState<boolean>(false);

  return (
    <li
      className="errors__item"
    >
      <p>{ errorMessage.error.message }</p>
      <button
        type="button"
        className="errors__close-button"
        onClick={dismiss}
      >
        <SVG name="close-nav" />
      </button>
      { showStack ? (
        <pre className="errors__stack">
          { errorMessage.error.stack }
        </pre>
      ) : (
        <button
          type="button"
          className="errors__stack-button"
          onClick={() => setShowStack(true)}
        >
          show stack
        </button>
      ) }
    </li>
  );
}

export default Error;
