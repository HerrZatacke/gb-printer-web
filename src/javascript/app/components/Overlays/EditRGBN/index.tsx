import React from 'react';
import Lightbox from '../../Lightbox';
import { RGBGrouping, useEditRGBNImages } from './useEditRGBNImages';
import SVG from '../../SVG';
import Select from '../Confirm/fields/Select';

import './index.scss';
import ImageRender from '../../ImageRender';
import { defaultRGBNPalette } from '../../../defaults';

function EditRGBN() {
  const {
    canConfirm,
    order,
    grouping,
    lengthWarning,
    rgbnHashes,
    updateOrder,
    setGrouping,
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
        <p className="edit-rgbn__info-text">Select how your selection is grouped.</p>
        <Select
          id="select-grouping"
          disabled={false}
          value={grouping}
          label=""
          options={[
            {
              value: RGBGrouping.BY_COLOR,
              name: 'Selection is grouped by colors (RRR GGG BBB)',
            },
            {
              value: RGBGrouping.BY_IMAGE,
              name: 'Selection is grouped by image (RGB RGB RGB)',
            },
          ]}
          setSelected={(value) => setGrouping(value as RGBGrouping)}
        />
        { lengthWarning ? (
          <p className="edit-rgbn__info-text edit-rgbn__info-text--warning">Warning: Your distribution of channels and number of selected images does not add up!</p>
        ) : null }

        <p className="edit-rgbn__info-text">Preview the RGBN images that will be created:</p>
        <ul className="edit-rgbn__image-list">
          { rgbnHashes.map((hashes, index) => (
            <li
              className="edit-rgbn__image-list-entry"
              key={index}
            >
              <ImageRender
                lockFrame={false}
                invertPalette={false}
                palette={defaultRGBNPalette}
                hash="newRGBN"
                hashes={hashes}
              />
            </li>
          ))}
        </ul>
      </div>
    </Lightbox>
  );
}

export default EditRGBN;
