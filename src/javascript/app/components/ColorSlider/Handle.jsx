import React from 'react';
import PropTypes from 'prop-types';

const Handle = ({ domain, handle, getHandleProps }) => {

  const {
    onKeyDown,
    onMouseDown,
    onTouchStart,
  } = getHandleProps(handle.id);

  return (
    <button
      role="slider"
      type="button"
      aria-valuemin={domain.min}
      aria-valuemax={domain.max}
      aria-valuenow={handle.value}
      className="color-slider__handle"
      style={{
        left: `${handle.percent}%`,
      }}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    />
  );
};

Handle.propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
};

Handle.defaultProps = {};

export default Handle;
