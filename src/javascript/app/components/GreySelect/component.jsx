import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'debounce';
import ColorSlider from '../ColorSlider';

class GreySelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = props.values;
    this.sendUpdate = debounce(this.sendUpdate, 150, false);
  }

  change(color, values) {
    this.setState({
      [color]: values,
    }, this.sendUpdate);
  }

  sendUpdate() {
    this.props.onChange(this.state, true);
  }

  render() {
    return (
      <div className="grey-select">
        {
          ['r', 'g', 'b', 'n']
            .map((color) => (
              <ColorSlider
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
