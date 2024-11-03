import React from 'react';
import classnames from 'classnames';
import Lightbox from '../../Lightbox';
import { RGBGrouping, useEditRGBNImages } from './useEditRGBNImages';
import SVG from '../../SVG';
import Select from '../Confirm/fields/Select';
import ImageRender from '../../ImageRender';
import RGBNSelect from '../../RGBNSelect';
import { defaultRGBNPalette } from '../../../defaults';
import type { RGBNHashes } from '../../../../../types/Image';

import './index.scss';

function previewPalette(isR: boolean, isG: boolean, isB: boolean, isN: boolean): string[] {
  const rPart = isR ? 255 : 0;
  const gPart = isG ? 255 : 0;
  const bPart = isB ? 255 : 0;

  const color = (r: number, g: number, b: number, intensity: number) => {
    const toIntensity = (v: number, i: number): string => (
      Math.floor(v * i).toString(16).padStart(2, '0')
    );

    return (
      `#${toIntensity(r, intensity)}${toIntensity(g, intensity)}${toIntensity(b, intensity)}`
    );
  };

  if (isR || isG || isB) {
    return [
      color(rPart, gPart, bPart, 1),
      color(rPart, gPart, bPart, 0.66),
      color(rPart, gPart, bPart, 0.33),
      '#000000',
    ];
  }

  if (isN) {
    return ['#ffffff', '#aaaaaa', '#555555', '#000000'];
  }

  return ['#b2b2b2', '#949494', '#737373', '#606060'];

}

function EditRGBN() {
  const {
    canConfirm,
    order,
    grouping,
    lengthWarning,
    rgbnHashes,
    sortedImages,
    createGroup,
    updateOrder,
    toggleSingleChannel,
    setGrouping,
    setCreateGroup,
    save,
    cancelEditRGBN,
  } = useEditRGBNImages();

  return (
    <Lightbox
      className="edit-rgbn"
      confirm={save}
      deny={cancelEditRGBN}
      closeOnOverlayClick={false}
      canConfirm={canConfirm && !lengthWarning}
      header="Create RGBN images"
    >
      <div
        className="edit-rgbn__content"
      >
        <Select
          id="select-grouping"
          disabled={false}
          value={grouping}
          label="Select how your selection is grouped."
          options={[
            {
              value: RGBGrouping.BY_COLOR,
              name: 'Selection is grouped by colors (RRR GGG BBB)',
            },
            {
              value: RGBGrouping.BY_IMAGE,
              name: 'Selection is grouped by image (RGB RGB RGB)',
            },
            {
              value: RGBGrouping.MANUAL,
              name: 'Manual selection for single image',
            },
          ]}
          setSelected={(value) => setGrouping(value as RGBGrouping)}
        />

        { grouping === RGBGrouping.MANUAL ? (
          <>
            <p className="edit-rgbn__info-text">Manually select the channels to create a single RGBN image.</p>
            <ul className="edit-rgbn__single-image-list">
              { sortedImages.map(({ hash }) => {
                const isR = rgbnHashes[0]?.r === hash;
                const isG = rgbnHashes[0]?.g === hash;
                const isB = rgbnHashes[0]?.b === hash;
                const isN = rgbnHashes[0]?.n === hash;

                return (
                  <li
                    key={hash}
                    className="edit-rgbn__single-image-list-entry"
                  >
                    <ImageRender
                      lockFrame={false}
                      invertPalette={false}
                      invertFramePalette={false}
                      palette={previewPalette(isR, isG, isB, isN)}
                      framePalette={previewPalette(isR, isG, isB, isN)}
                      hash={hash}
                    />
                    <RGBNSelect
                      isR={isR}
                      isG={isG}
                      isB={isB}
                      isN={isN}
                      toggleChannel={(channel: keyof RGBNHashes) => toggleSingleChannel(channel, hash)}
                    />
                  </li>
                );
              }) }
            </ul>
          </>
        ) : (
          <>
            <p className="edit-rgbn__info-text">Select the order of channels to be applied (in the order of images taken). Channels to the right of the separator will not be used.</p>
            <ul className="edit-rgbn__order-list">
              { order.map((colorKey, index) => (colorKey === 's' ? (
                <li
                  key={colorKey}
                  className="edit-rgbn__order-list-entry edit-rgbn__order-list-entry--separator"
                />
              ) : (
                <li
                  key={colorKey}
                  className={`edit-rgbn__order-list-entry edit-rgbn__order-list-entry--${colorKey}`}
                >
                  <button
                    className="edit-rgbn__order-list-button"
                    type="button"
                    onClick={() => updateOrder(colorKey, index - 1)}
                  >
                    <SVG name="left" />
                  </button>
                  <button
                    className="edit-rgbn__order-list-button"
                    type="button"
                    onClick={() => updateOrder(colorKey, index + 1)}
                  >
                    <SVG name="right" />
                  </button>
                </li>
              )))}
            </ul>

            { lengthWarning ? (
              <p className="edit-rgbn__info-text edit-rgbn__info-text--warning">Warning: Your distribution of channels and number of selected images does not add up!</p>
            ) : null }

            <p className="edit-rgbn__info-text">Preview the RGBN images that will be created:</p>
          </>
        ) }

        <ul className="edit-rgbn__image-list">
          { rgbnHashes.map((hashes, index) => (
            <li
              className="edit-rgbn__image-list-entry"
              key={index}
            >
              <ImageRender
                lockFrame={false}
                invertPalette={false}
                invertFramePalette={false}
                palette={defaultRGBNPalette}
                framePalette={[]}
                hash="newRGBN"
                hashes={hashes}
              />
            </li>
          ))}
        </ul>

        <label
          className={
            classnames('import-overlay__checkgroup inputgroup checkgroup', {
              'checkgroup--checked': createGroup,
            })
          }
        >
          <span
            className="inputgroup__label"
            title="Create group from images"
          >
            Create group from created images
          </span>
          <span
            className="checkgroup__checkbox-wrapper"
          >
            <input
              type="checkbox"
              className="checkgroup__input"
              checked={createGroup}
              onChange={({ target }) => {
                setCreateGroup(target.checked);
              }}
            />
            <SVG name="checkmark" />
          </span>
        </label>
      </div>
    </Lightbox>
  );
}

export default EditRGBN;
