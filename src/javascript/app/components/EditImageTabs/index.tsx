/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import classnames from 'classnames';
import type { RGBNPalette } from 'gb-image-decoder';
import FrameSelect from '../FrameSelect';
import GreySelect from '../GreySelect';
import PaletteSelect from '../PaletteSelect';
import TagsSelect from '../TagsSelect';
import ImageMeta from '../ImageMeta';
import './index.scss';
import type { TagChange } from '../../../tools/applyTagChanges';
import { reduceItems } from '../../../tools/reduceArray';
import type { ImageMetadata, RGBNHashes } from '../../../../types/Image';
import type { Rotation } from '../../../tools/applyRotation';
import type { TagUpdateMode } from '../../../tools/modifyTagChanges';

enum Tab {
  PALETTE = 'pal',
  FRAME = 'frame',
  TAGS = 'tags',
  MISC = 'misc',
}

interface Props {
  hash: string,
  invertPalette?: boolean,
  invertFramePalette?: boolean,
  tags: TagChange,
  regularImage: boolean,
  lockFrame?: boolean,

  updateCreated: (value: string) => void,
  updatePalette: (paletteUpdate: (string | RGBNPalette), confirm?: boolean) => void,
  updateInvertPalette: (value: boolean) => void,
  updateFramePalette: (paletteUpdate: string, confirm?: boolean) => void,
  updateInvertFramePalette: (value: boolean) => void,
  updateTags: (mode: TagUpdateMode, tag: string) => void,
  updateFrame: (value: string) => void,
  updateFrameLock: (value: boolean) => void,
  updateRotation: (value: Rotation) => void,

  hashes?: RGBNHashes,
  created?: string,
  paletteShort?: string,
  framePaletteShort?: string,
  paletteRGBN?: RGBNPalette,
  frame?: string,
  meta?: ImageMetadata,
  rotation?: number,
  mixedTypes?: boolean,
}

function EditImageTabs(props: Props) {

  const tabs: Tab[] = [
    props.mixedTypes ? null : Tab.PALETTE,
    props.regularImage ? Tab.FRAME : null,
    Tab.TAGS,
    props.meta ? Tab.MISC : null,
  ].reduce(reduceItems<Tab>, []);

  const [tab, setTab] = useState(tabs[0]);
  const [tabIndex, setTabIndex] = useState(0);

  const focusEvent = (newTab: Tab) => () => {
    setTab(newTab);
    setTabIndex(tabs.findIndex((key) => key === newTab));
  };

  return (
    <div className="edit-image-tabs">
      <ul
        className="edit-image-tabs__list"
        style={{
          marginLeft: `-${tabIndex * 100}%`,
        }}
      >
        { tabs.includes(Tab.PALETTE) ? (
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': tab === 'pal',
              })
            }
            onFocus={focusEvent(Tab.PALETTE)}
            onClick={focusEvent(Tab.PALETTE)}
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
                    r: !!props.hashes?.r,
                    g: !!props.hashes?.g,
                    b: !!props.hashes?.b,
                    n: !!props.hashes?.n,
                  }}
                />
              </>
            ) : (
              <>
                <button type="button" className="edit-image-tabs__button">
                  Select Palette
                </button>
                <PaletteSelect
                  value={props.paletteShort || ''}
                  invertPalette={props.invertPalette}
                  onChange={props.updatePalette}
                  updateInvertPalette={props.updateInvertPalette}
                />
              </>
            )}
          </li>
        ) : null}
        { tabs.includes(Tab.FRAME) ? (
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': tab === Tab.FRAME,
              })
            }
            onFocus={focusEvent(Tab.FRAME)}
            onClick={focusEvent(Tab.FRAME)}
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
            {
              props.lockFrame && !props.paletteRGBN ? (
                <PaletteSelect
                  value={props.framePaletteShort || ''}
                  invertPalette={props.invertFramePalette}
                  onChange={props.updateFramePalette}
                  updateInvertPalette={props.updateInvertFramePalette}
                />
              ) : null
            }
          </li>
        ) : null}
        { tabs.includes(Tab.TAGS) ? (
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': tab === Tab.TAGS,
              })
            }
            onFocus={focusEvent(Tab.TAGS)}
            onClick={focusEvent(Tab.TAGS)}
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
        { tabs.includes(Tab.MISC) ? (
          <li
            className={
              classnames('edit-image-tabs__tab', {
                'edit-image-tabs__tab--active': tab === Tab.MISC,
              })
            }
            onFocus={focusEvent(Tab.MISC)}
            onClick={focusEvent(Tab.MISC)}
          >
            <button type="button" className="edit-image-tabs__button">
              Misc
            </button>
            { props.meta ? (
              <ImageMeta
                created={props.created}
                hash={props.hash}
                hashes={props.hashes}
                updateCreated={props.updateCreated}
                meta={props.meta}
                rotation={props.rotation}
                updateRotation={props.updateRotation}
              />
            ) : null }
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default EditImageTabs;
