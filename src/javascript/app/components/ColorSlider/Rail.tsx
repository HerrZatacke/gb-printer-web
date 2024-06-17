import React from 'react';
import PropTypes from 'prop-types';
import type { GetRailProps } from 'react-compound-slider';

interface Props {
  getRailProps: GetRailProps,
}

function Rail({ getRailProps }: Props) {
  const { onMouseDown, onTouchStart } = getRailProps();
  return (
    <button
      type="button"
      className="color-slider__rail"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      tabIndex={-1}
    >
      <div className="color-slider__rail-inner" />
    </button>
  );
}

Rail.propTypes = {
  getRailProps: PropTypes.func.isRequired,
};

export default Rail;
