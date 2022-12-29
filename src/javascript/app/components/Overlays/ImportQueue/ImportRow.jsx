import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import GameBoyImage from '../../GameBoyImage/component';
import SVG from '../../SVG';
import { FRAMEQUEUE_ADD, IMPORTQUEUE_CANCEL_ONE } from '../../../store/actions';

function ImportRow({
  tiles,
  fileName,
  dataHash,
  tempId,
}) {
  const storeDuplicate = useSelector((state) => state.images.find(({ hash }) => hash === dataHash));
  const { length: queueDuplicates } = useSelector((state) => (
    state.importQueue.filter((item) => item.dataHash === dataHash)
  ));

  const dispatch = useDispatch();

  return (
    <li className="import-image">
      <span className="import-image__image-zoom">
        <span className="import-image__image">
          <GameBoyImage
            tiles={tiles}
            invertPalette={false}
            lockFrame={false}
            palette={['#ffffff', '#aaaaaa', '#555555', '#000000']}
            asThumb
          />
        </span>
      </span>
      <div className="import-image__duplicate-icons">
        { (
          storeDuplicate ? (
            <div
              className="import-image__duplicate-icon"
              title={`This image has already been imported${storeDuplicate.title ? ` as "${storeDuplicate.title}"` : ''}`}
            >
              <SVG name="warn" />
            </div>
          ) : null
        ) }
        { (
          queueDuplicates > 1 ? (
            <div
              className="import-image__duplicate-icon"
              title="This image exists multiple times within this queue"
            >
              <SVG name="warn" />
            </div>
          ) : null
        ) }
      </div>
      <div className="import-image__meta">
        <div className="import-image__name">
          { fileName }
        </div>
      </div>
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
              payload: tempId,
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
  dataHash: PropTypes.string.isRequired,
  tempId: PropTypes.string.isRequired,
};

export default ImportRow;
