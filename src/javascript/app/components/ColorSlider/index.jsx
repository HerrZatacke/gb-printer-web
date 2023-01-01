import React from 'react';
import PropTypes from 'prop-types';
import { Slider, Rail, Handles } from 'react-compound-slider';
import Handle from './Handle';
import SliderRail from './Rail';
import SVG from '../SVG';
import './index.scss';

const COLOR_RANGE = [0, 255];

const ColorSlider = (props) => (
  <div className="color-slider" data-color={props.color}>
    <button
      className="color-slider__button color-slider__button--reset"
      type="button"
      onClick={() => {
        props.onChange([0x00, 0x55, 0xaa, 0xff]);
      }}
    >
      <SVG name="reset" />
    </button>
    <Slider
      className="color-slider__root"
      mode={2}
      step={4}
      domain={COLOR_RANGE}
      onUpdate={props.onChange}
      onChange={props.onChange}
      values={props.values}
    >
      <Rail>
        {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div className="slider-handles">
            {handles.map((handle) => (
              <Handle
                key={handle.id}
                handle={handle}
                domain={COLOR_RANGE}
                getHandleProps={getHandleProps}
              />
            ))}
          </div>
        )}
      </Handles>
    </Slider>
  </div>
);

ColorSlider.propTypes = {
  color: PropTypes.oneOf(['r', 'g', 'b', 'n']).isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
};

export default ColorSlider;
