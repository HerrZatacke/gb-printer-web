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

  const tabs = [
    props.mixedTypes ? '' : 'pal',
    props.regularImage ? 'frame' : '',
    'tags',
    'misc',
  ].filter(Boolean);

  const [tab, setTab] = useState(tabs[0]);
  const [tabIndex, setTabIndex] = useState(0);

  const focusEvent = (newTab) => () => {
    setTab(newTab);
    setTabIndex(tabs.findIndex((key) => key === newTab));
  };

  return (
    <div className="edit-image-tabs">
      {tabs.join(' ')}
      <ul
        className="edit-image-tabs__list"
        style={{
          marginLeft: `-${tabIndex * 100}%`,
        }}
      >
        { tabs.includes('pal') ? (
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': tab === 'pal',
              })
            }
            onFocus={focusEvent('pal')}
            onClick={focusEvent('pal')}
          >
            {props.paletteRGBN ? (
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
            )}
          </li>
        ) : null}
        { tabs.includes('frame') ? (
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': tab === 'frame',
              })
            }
            onFocus={focusEvent('frame')}
            onClick={focusEvent('frame')}
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
        { tabs.includes('tags') ? (
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': tab === 'tags',
              })
            }
            onFocus={focusEvent('tags')}
            onClick={focusEvent('tags')}
          >
            <button type="button" className="edit-image-tabs__button">
              Tags
            </button>
            <TagsSelect
              updateTags={props.updateTags}
              tags={props.tags}
            />
          </li>
        ) : null}
        { tabs.includes('misc') ? (
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': tab === 'misc',
              })
            }
            onFocus={focusEvent('misc')}
            onClick={focusEvent('misc')}
          >
            <button type="button" className="edit-image-tabs__button">
              Misc
            </button>
            <ImageMeta
              created={props.created}
              hash={props.hash}
              hashes={props.hashes}
              updatecreated={props.updateCreated}
              meta={props.meta}
              rotation={props.rotation}
              updateRotation={props.updateRotation}
            />
          </li>
        ) : null}
      </ul>
    </div>
  );
};

EditImageTabs.propTypes = {
  // cancel: PropTypes.func.isRequired,
  hash: PropTypes.string.isRequired,
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
  updateRotation: PropTypes.func.isRequired,
  meta: PropTypes.object,
  rotation: PropTypes.number,
  mixedTypes: PropTypes.bool,
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
  rotation: null,
  mixedTypes: null,
};

export default EditImageTabs;
