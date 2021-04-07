import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../Lightbox';

const ProgressBox = ({ message, progress }) => (
  progress ? (
    <Lightbox
      className="progress-box"
      header={message.headline}
    >
      <div className="progress-box__message">
        { message }
      </div>
      <progress
        className="progress-box__progress"
        value={progress}
        max={1}
      />
    </Lightbox>
  ) : null
);

ProgressBox.propTypes = {
  message: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
};

export default ProgressBox;
