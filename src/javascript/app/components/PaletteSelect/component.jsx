import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class PaletteSelect extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      initiallySelected: props.value,
    };
  }

  render() {
    return (
      <>
        <h3 className="edit-image__section-title">Select Palette</h3>
        <select
          className="palette-select"
          value={this.props.value}
          onChange={(ev) => {
            this.props.onChange(ev.target.value);
            this.setState({
              initiallySelected: ev.target.value,
            });
          }}
        >
          {
            this.props.palettes.map(({ shortName, name }) => (
              <option
                key={shortName}
                value={shortName}
              >
                { name }
              </option>
            ))
          }
        </select>
        <ul className="fancy-palette-select">
          {
            this.props.palettes.map(({ shortName, name, palette }) => (
              <li
                key={shortName}
                className={
                  classnames('fancy-palette-select__entry', {
                    'fancy-palette-select__entry--active': this.state.initiallySelected === shortName,
                  })
                }
              >
                <button
                  type="button"
                  className="fancy-palette-select__button"
                  title={name}
                  onClick={() => {
                    this.props.onChange(shortName);
                    this.setState({
                      initiallySelected: shortName,
                    });
                  }}
                  onMouseEnter={() => {
                    this.props.onChange(shortName);
                  }}
                  onMouseLeave={() => {
                    this.props.onChange(this.state.initiallySelected);
                  }}
                >
                  <span className="fancy-palette-select__color" style={{ backgroundColor: palette[0] }} />
                  <span className="fancy-palette-select__color" style={{ backgroundColor: palette[1] }} />
                  <span className="fancy-palette-select__color" style={{ backgroundColor: palette[2] }} />
                  <span className="fancy-palette-select__color" style={{ backgroundColor: palette[3] }} />
                </button>
              </li>
            ))
          }
        </ul>
      </>
    );
  }
}

PaletteSelect.propTypes = {
  palettes: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

PaletteSelect.defaultProps = {};

export default PaletteSelect;
