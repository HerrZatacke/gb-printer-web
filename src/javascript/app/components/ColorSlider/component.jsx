import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slider, Rail, Handles } from 'react-compound-slider';
import Handle from './Handle';
import SliderRail from './Rail';

const sliderStyle = {
  position: 'relative',
  width: '400px',
  margin: '0 40px',
};

const COLOR_RANGE = [0, 255];

class ColorSlider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      values: props.values,
    };
  }

  render() {
    return (
      <div className="color-slider" data-color={this.props.color}>
        <Slider
          mode={2}
          step={4}
          domain={COLOR_RANGE}
          rootStyle={sliderStyle}
          onUpdate={this.props.onChange}
          onChange={this.props.onChange}
          values={this.state.values}
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
  }
}

ColorSlider.propTypes = {
  color: PropTypes.oneOf(['r', 'g', 'b', 'n']).isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
};

export default ColorSlider;
