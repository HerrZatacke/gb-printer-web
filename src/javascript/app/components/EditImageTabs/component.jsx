import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FrameSelect from '../FrameSelect';
import GreySelect from '../GreySelect';
import PaletteSelect from '../PaletteSelect';

class EditImageTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }

  render() {
    return (
      <div className="edit-image-tabs">
        <ul
          className="edit-image-tabs__list"
          style={{
            marginLeft: `-${this.state.tabIndex * 100}%`,
          }}
        >
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': this.state.tabIndex === 0,
              })
            }
            onFocus={() => {
              this.setState({
                tabIndex: 0,
              });
            }}
          >
            { this.props.hashes ? (
              <>
                <button type="button" className="edit-image-tabs__button">
                  Edit Greytones
                </button>
                <GreySelect
                  values={this.props.palette}
                  onChange={this.props.updatePalette}
                />
              </>
            ) : (
              <>
                <button type="button" className="edit-image-tabs__button">
                  Select Palette
                </button>
                <PaletteSelect
                  value={this.props.palette.shortName}
                  onChange={this.props.updatePalette}
                />
              </>
            ) }
          </li>
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': this.state.tabIndex === 1,
              })
            }
            onFocus={() => {
              this.setState({
                tabIndex: 1,
              });
            }}
          >
            <button type="button" className="edit-image-tabs__button">
              Select Frame
            </button>
            <FrameSelect
              updateFrame={this.props.updateFrame}
              frame={this.props.frame || ''}
            />
          </li>
          { /* <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': this.state.tabIndex === 2,
              })
            }
            onFocus={() => {
              this.setState({
                tabIndex: 2,
              });
            }}
          >
            <button type="button" className="edit-image-tabs__button">
              Tags
            </button>
            <p>Tags will be editable here...</p>
          </li> */ }
        </ul>
      </div>
    );
  }
}

EditImageTabs.propTypes = {
  // cancel: PropTypes.func.isRequired,
  // hash: PropTypes.string,
  hashes: PropTypes.object,
  palette: PropTypes.object,
  frame: PropTypes.string,
  // frames: PropTypes.object,
  // save: PropTypes.func.isRequired,
  // title: PropTypes.string,
  updatePalette: PropTypes.func.isRequired,
  // updateTitle: PropTypes.func.isRequired,
  updateFrame: PropTypes.func.isRequired,
};

EditImageTabs.defaultProps = {
  // title: null,
  // hash: null,
  hashes: null,
  palette: null,
  frame: null,
  // frames: null,
};

export default EditImageTabs;
