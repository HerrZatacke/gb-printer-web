import React from 'react';
import PropTypes from 'prop-types';
import Slider from '../ColorSlider';

class GreySelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = props.values;
  }

  change(color, values) {
    this.setState({
      [color]: values,
    }, () => {
      this.props.onChange(this.state);
    });
  }

  render() {
    return (
      <div className="grey-select">
        {
          ['r', 'g', 'b', 'n']
            .map((color) => (
              <Slider
                key={`slider-${color}`}
                color={color}
                values={this.state[color]}
                onChange={(values) => {
                  this.change(color, values);
                }}
              />
            ))
        }
      </div>
    );
  }
}

GreySelect.propTypes = {
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

GreySelect.defaultProps = {};

export default GreySelect;
