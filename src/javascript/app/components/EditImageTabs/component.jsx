/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FrameSelect from '../FrameSelect';
import GreySelect from '../GreySelect';
import PaletteSelect from '../PaletteSelect';
import TagsSelect from '../TagsSelect';
import ImageMeta from '../ImageMeta';

class EditImageTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }

  focusEvent(tabIndex) {
    return () => {
      this.setState({
        tabIndex,
      });
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
            onFocus={this.focusEvent(0)}
            onClick={this.focusEvent(0)}
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
                  value={this.props.palette ? this.props.palette.shortName : ''}
                  invertPalette={this.props.invertPalette}
                  onChange={this.props.updatePalette}
                  updateInvertPalette={this.props.updateInvertPalette}
                />
              </>
            ) }
          </li>
          {this.props.regularImage ? (
            // if image does not have exact height of a gameboy-camera image, frame select is not avaliable
            <li
              className={
                classnames('edit-image-tabs__tab', {
                  'edit-image-tabs__tab--active': this.state.tabIndex === 1,
                })
              }
              onFocus={this.focusEvent(1)}
              onClick={this.focusEvent(1)}
            >
              <button type="button" className="edit-image-tabs__button">
                Select Frame
              </button>
              <FrameSelect
                updateFrame={this.props.updateFrame}
                updateFrameLock={this.props.updateFrameLock}
                frame={this.props.frame || ''}
                lockFrame={this.props.lockFrame}
              />
            </li>
          ) : null}
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': this.state.tabIndex === 2,
              })
            }
            onFocus={this.focusEvent(this.props.regularImage ? 2 : 1)}
            onClick={this.focusEvent(this.props.regularImage ? 2 : 1)}
          >
            <button type="button" className="edit-image-tabs__button">
              Tags
            </button>
            <TagsSelect
              updateTags={this.props.updateTags}
              tags={this.props.tags}
              batchTags={this.props.batchTags}
            />
          </li>
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': this.state.tabIndex === 3,
              })
            }
            onFocus={this.focusEvent(this.props.regularImage ? 3 : 2)}
            onClick={this.focusEvent(this.props.regularImage ? 3 : 2)}
          >
            <button type="button" className="edit-image-tabs__button">
              Misc
            </button>
            <ImageMeta
              created={this.props.created}
              updatecreated={this.props.updateCreated}
            />
          </li>
        </ul>
      </div>
    );
  }
}

EditImageTabs.propTypes = {
  // cancel: PropTypes.func.isRequired,
  // hash: PropTypes.string,
  hashes: PropTypes.object,
  created: PropTypes.string,
  palette: PropTypes.object,
  invertPalette: PropTypes.bool.isRequired,
  frame: PropTypes.string,
  tags: PropTypes.shape({
    initial: PropTypes.array.isRequired,
    add: PropTypes.array.isRequired,
    remove: PropTypes.array.isRequired,
  }).isRequired,
  batchTags: PropTypes.shape({
    initial: PropTypes.array.isRequired,
    add: PropTypes.array.isRequired,
    remove: PropTypes.array.isRequired,
  }),
  // frames: PropTypes.object,
  // save: PropTypes.func.isRequired,
  // title: PropTypes.string,
  regularImage: PropTypes.bool.isRequired,
  lockFrame: PropTypes.bool.isRequired,
  updateCreated: PropTypes.func.isRequired,
  updatePalette: PropTypes.func.isRequired,
  updateInvertPalette: PropTypes.func.isRequired,
  updateTags: PropTypes.func.isRequired,
  updateFrame: PropTypes.func.isRequired,
  updateFrameLock: PropTypes.func.isRequired,
};

EditImageTabs.defaultProps = {
  // title: null,
  // hash: null,
  hashes: null,
  batchTags: null,
  palette: null,
  frame: null,
  created: null,
  // frames: null,
};

export default EditImageTabs;
