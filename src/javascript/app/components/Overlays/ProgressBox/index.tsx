import React from 'react';
import Lightbox from '../../Lightbox';
import { useProgressBox } from './useProgressBox';

import './index.scss';

function ProgressBox() {
  const { message, progress } = useProgressBox();

  return (
    progress ? (
      <Lightbox
        className="progress-box"
      >
        <div className="progress-box__message">
          {message}
        </div>
        <progress
          className="progress-box__progress"
          value={progress}
          max={1}
        />
      </Lightbox>
    ) : null
  );
}

export default ProgressBox;
