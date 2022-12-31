import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import GameBoyImage from '../../GameBoyImage/component';
import SVG from '../../SVG';
import { FRAMEQUEUE_ADD, IMPORTQUEUE_CANCEL_ONE } from '../../../store/actions';

function ImportRow({
  tiles,
  fileName,
  imageHash,
  frameHash,
  tempId,
  paletteShort,
}) {
  const palette = useSelector((state) => state.palettes.find(({ shortName }) => shortName === paletteShort));
  const storeDuplicateImage = useSelector((state) => state.images.find(({ hash }) => hash === imageHash));
  const storeDuplicateFrame = useSelector((state) => state.frames.find(({ hash }) => hash === frameHash));
  const { length: queueDuplicates } = useSelector((state) => (
    state.importQueue.filter((item) => item.imageHash === imageHash)
  ));

  const dispatch = useDispatch();

  return (
    <li className="import-image">
      <span
        className="import-image__image-zoom"
        style={{
          height: `${tiles.length / 2.5 / 2.66}px`,
        }}
      >
        <span className="import-image__image">
          <GameBoyImage
            tiles={tiles}
            invertPalette={false}
            lockFrame={false}
            palette={palette.palette}
            asThumb
          />
        </span>
      </span>
      <div className="import-image__meta">
        <div className="import-image__name">
          { fileName }
        </div>
      </div>
      <div className="import-image__duplicate-icons">
        { (
          queueDuplicates > 1 ? (
            <div
              className="import-image__duplicate-icon import-image__duplicate-icon--queue"
              title="This image exists multiple times within this queue"
            >
              D
            </div>
          ) : null
        ) }
        { (
          storeDuplicateImage ? (
            <div
              className="import-image__duplicate-icon import-image__duplicate-icon--image"
              title={`This image has already been imported${storeDuplicateImage.title ? ` as "${storeDuplicateImage.title}"` : ''}`}
            >
              I
            </div>
          ) : null
        ) }
        { (
          storeDuplicateFrame ? (
            <div
              className="import-image__duplicate-icon import-image__duplicate-icon--frame"
              title={`This frame has already been imported${storeDuplicateFrame.name ? ` as "${storeDuplicateFrame.name}"` : ''}`}
            >
              F
            </div>
          ) : null
        ) }
      </div>
      <div className="import-image__buttons">
        { tiles.length === 360 ? (
          <button
            className="import-image__button import-image__button--frame"
            type="button"
            title="Import as Frame"
            onClick={() => {
              dispatch({
                type: FRAMEQUEUE_ADD,
                payload: {
                  fileName,
                  tiles,
                  imageHash,
                  tempId,
                },
              });
            }}
          >
            <SVG
              className="import-image__icon"
              name="frame"
            />
          </button>
        ) : null }
        <button
          className="import-image__button import-image__button--delete"
          type="button"
          title="Delete"
          onClick={() => {
            dispatch({
              type: IMPORTQUEUE_CANCEL_ONE,
              payload: { tempId },
            });
          }}
        >
          <SVG
            className="import-image__icon"
            name="delete"
          />
        </button>
      </div>
    </li>
  );
}

ImportRow.propTypes = {
  tiles: PropTypes.array.isRequired,
  fileName: PropTypes.string.isRequired,
  imageHash: PropTypes.string.isRequired,
  frameHash: PropTypes.string.isRequired,
  paletteShort: PropTypes.string.isRequired,
  tempId: PropTypes.string.isRequired,
};

export default ImportRow;
