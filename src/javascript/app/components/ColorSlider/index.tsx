import React from 'react';
import { Slider, Rail, Handles } from 'react-compound-slider';
import Handle from './Handle';
import SliderRail from './Rail';
import SVG from '../SVG';
import './index.scss';
import { RGBNHashes } from '../../../../types/Image';

const COLOR_RANGE = [0, 255];

interface Props {
  color: keyof RGBNHashes,
  onChange: (values: readonly number[]) => void,
  values: number[],
}

const ColorSlider = ({ color, onChange, values }: Props) => (
  <div className="color-slider" data-color={color}>
    <button
      className="color-slider__button color-slider__button--reset"
      type="button"
      onClick={() => {
        onChange([0x00, 0x55, 0xaa, 0xff]);
      }}
    >
      <SVG name="reset" />
    </button>
    <Slider
      className="color-slider__root"
      mode={2}
      step={4}
      domain={COLOR_RANGE}
      onUpdate={onChange}
      onChange={onChange}
      values={values}
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

export default ColorSlider;
