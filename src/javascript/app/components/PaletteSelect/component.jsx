import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

class PaletteSelect extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      initiallySelected: props.value,
    };
  }

  render() {
    const palettes = [...this.props.palettes];

    // this option is used for assigning a single palette to an animation
    if (this.props.allowEmpty) {
      palettes.unshift({
        shortName: '',
        name: 'As selected per image',
        palette: [],
      });
    }

    return (
      <>
        <select
          className="palette-select"
          value={this.props.value}
          onChange={(ev) => {
            this.props.onChange(ev.target.value, true);
            this.setState({
              initiallySelected: ev.target.value,
            });
          }}
        >
          {
            palettes.map(({ shortName, name }) => (
              <option
                key={shortName}
                value={shortName}
              >
                { name }
              </option>
            ))
          }
        </select>
        <label
          className={
            classnames('palette-select__check-label', {
              'palette-select__check-label--checked': this.props.invertPalette,
            })
          }
        >
          <input
            type="checkbox"
            className="palette-select__checkbox"
            checked={this.props.invertPalette}
            onChange={({ target }) => {
              this.props.updateInvertPalette(target.checked);
            }}
          />
          <SVG name="checkmark" />
          <span className="palette-select__check-label-text">
            Invert Palette
          </span>
        </label>
        { this.props.noFancy ? null : (
          <ul className="fancy-palette-select">
            {
              palettes.map(({ shortName, name, palette }) => (
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
                      this.props.onChange(shortName, true);
                      this.setState({
                        initiallySelected: shortName,
                      });
                    }}
                    onMouseEnter={() => {
                      this.props.onChange(shortName, false);
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
        )}
      </>
    );
  }
}

PaletteSelect.propTypes = {
  palettes: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  invertPalette: PropTypes.bool.isRequired,
  updateInvertPalette: PropTypes.func.isRequired,
  noFancy: PropTypes.bool,
  allowEmpty: PropTypes.bool,
};

PaletteSelect.defaultProps = {
  noFancy: false,
  allowEmpty: false,
};

export default PaletteSelect;
