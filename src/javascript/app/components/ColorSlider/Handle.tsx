import React from 'react';
import { GetHandleProps, SliderItem } from 'react-compound-slider';

interface Props {
  domain: number[],
  handle: SliderItem,
  getHandleProps: GetHandleProps,
}

const Handle = ({ domain, handle, getHandleProps }: Props) => {
  const {
    onKeyDown,
    onMouseDown,
    onTouchStart,
  } = getHandleProps(handle.id);

  return (
    <button
      role="slider"
      type="button"
      aria-valuemin={domain[0]}
      aria-valuemax={domain[1]}
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

export default Handle;
