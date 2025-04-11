import React from 'react';
import OldLightbox from '../../Lightbox';
import { useProgressBox } from './useProgressBox';

import './index.scss';

function ProgressBox() {
  const { message, progress } = useProgressBox();

  return (
    progress ? (
      <OldLightbox
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
      </OldLightbox>
    ) : null
  );
}

export default ProgressBox;
