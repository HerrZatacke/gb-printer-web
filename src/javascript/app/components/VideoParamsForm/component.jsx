import React from 'react';
import PropTypes from 'prop-types';

const VideoParamsForm = (props) => {
  if (!props.imageCount) {
    return null;
  }

  return (
    <div>
      {JSON.stringify(props, null, 2)}
      <button
        type="button"
        onClick={() => props.cancel()}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={() => props.animate()}
      >
        Animate
      </button>
    </div>
  );
};

VideoParamsForm.propTypes = {
  imageCount: PropTypes.number.isRequired,
  cancel: PropTypes.func.isRequired,
  animate: PropTypes.func.isRequired,
};

export default VideoParamsForm;
