/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FrameSelect from '../FrameSelect';
import GreySelect from '../GreySelect';
import PaletteSelect from '../PaletteSelect';
import TagsSelect from '../TagsSelect';
import ImageMeta from '../ImageMeta';
import './index.scss';

const EditImageTabs = (props) => {

  const [tabIndex, setTabIndex] = useState(0);

  const focusEvent = (newTabIndex) => () => {
    setTabIndex(newTabIndex);
  };

  return (
    <div className="edit-image-tabs">
      <ul
        className="edit-image-tabs__list"
        style={{
          marginLeft: `-${tabIndex * 100}%`,
        }}
      >
        <li
          className={
            classnames('edit-image-tabs__tab', {
              'edit-image-tabs__tab--active': tabIndex === 0,
            })
          }
          onFocus={focusEvent(0)}
          onClick={focusEvent(0)}
        >
          { props.paletteRGBN ? (
            <>
              <button type="button" className="edit-image-tabs__button">
                Edit Greytones
              </button>
              <GreySelect
                values={props.paletteRGBN}
                onChange={props.updatePalette}
                useChannels={{
                  r: !!props.hashes.r,
                  g: !!props.hashes.g,
                  b: !!props.hashes.b,
                  n: !!props.hashes.n,
                }}
              />
            </>
          ) : (
            <>
              <button type="button" className="edit-image-tabs__button">
                Select Palette
              </button>
              <PaletteSelect
                value={props.paletteShort}
                invertPalette={props.invertPalette}
                onChange={props.updatePalette}
                updateInvertPalette={props.updateInvertPalette}
              />
            </>
          ) }
        </li>
        {props.regularImage ? (
          // if image does not have exact height of a gameboy-camera image, frame select is not avaliable
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': tabIndex === 1,
              })
            }
            onFocus={focusEvent(1)}
            onClick={focusEvent(1)}
          >
            <button type="button" className="edit-image-tabs__button">
              Select Frame
            </button>
            <FrameSelect
              updateFrame={props.updateFrame}
              updateFrameLock={props.updateFrameLock}
              frame={props.frame || ''}
              lockFrame={props.lockFrame}
            />
          </li>
        ) : null}
        <li
          className={
            classnames('edit-image-tabs__tab', {
              'edit-image-tabs__tab--active': tabIndex === 2,
            })
          }
          onFocus={focusEvent(props.regularImage ? 2 : 1)}
          onClick={focusEvent(props.regularImage ? 2 : 1)}
        >
          <button type="button" className="edit-image-tabs__button">
            Tags
          </button>
          <TagsSelect
            updateTags={props.updateTags}
            tags={props.tags}
          />
        </li>
        <li
          className={
            classnames('edit-image-tabs__tab', {
              'edit-image-tabs__tab--active': tabIndex === 3,
            })
          }
          onFocus={focusEvent(props.regularImage ? 3 : 2)}
          onClick={focusEvent(props.regularImage ? 3 : 2)}
        >
          <button type="button" className="edit-image-tabs__button">
            Misc
          </button>
          <ImageMeta
            created={props.created}
            updatecreated={props.updateCreated}
            meta={props.meta}
          />
        </li>
      </ul>
    </div>
  );
};

EditImageTabs.propTypes = {
  // cancel: PropTypes.func.isRequired,
  // hash: PropTypes.string,
  hashes: PropTypes.object,
  created: PropTypes.string,
  paletteShort: PropTypes.string,
  paletteRGBN: PropTypes.object,
  invertPalette: PropTypes.bool.isRequired,
  frame: PropTypes.string,
  tags: PropTypes.shape({
    initial: PropTypes.array.isRequired,
    add: PropTypes.array.isRequired,
    remove: PropTypes.array.isRequired,
  }).isRequired,
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
  meta: PropTypes.object,
};

EditImageTabs.defaultProps = {
  // title: null,
  // hash: null,
  hashes: null,
  paletteShort: '',
  paletteRGBN: null,
  frame: null,
  created: null,
  // frames: null,
  meta: null,
};

export default EditImageTabs;
