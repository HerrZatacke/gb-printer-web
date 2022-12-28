import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import GameBoyImage from '../../GameBoyImage/component';
import SVG from '../../SVG';
import { FRAMEQUEUE_ADD, IMPORTQUEUE_CANCEL_ONE } from '../../../store/actions';

function ImportRow({
  tiles,
  fileName,
}) {
  const palette = useSelector((state) => state.palettes.find(({ shortName }) => shortName === state.activePalette));

  const dispatch = useDispatch();

  return (
    <li className="import-image">
      <span className="import-image__image-zoom">
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
      <p className="import-image__name">
        { fileName }
      </p>
      <div className="import-image__buttons">
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
              },
            });
          }}
        >
          <SVG
            className="import-image__icon"
            name="frame"
          />
        </button>
        <button
          className="import-image__button import-image__button--delete"
          type="button"
          title="Delete"
          onClick={() => {
            dispatch({
              type: IMPORTQUEUE_CANCEL_ONE,
              payload: fileName,
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
};

export default ImportRow;
