import React from 'react';
import Lightbox from '../../Lightbox';
import useTrashbin from '../../../../hooks/useTrashbin';
import './index.scss';

function Trashbin() {
  const {
    showTrash,
    purgeTrash,
    downloadImages,
    downloadFrames,
    trashCount,
  } = useTrashbin();

  const sum = trashCount.frames + trashCount.images;

  return (
    <Lightbox
      className="trashbin"
      confirm={() => {
        showTrash(false);
      }}
      header={`Trash (${sum} items)`}
    >
      <ul className="trashbin__list">
        <li className="trashbin__option">
          <button
            type="button"
            className="trashbin__button button"
            title="Download deleted frames"
            disabled={trashCount.frames === 0}
            onClick={downloadFrames}
          >
            <span className="trashbin__button-label">
              { `Download deleted frames (${trashCount.frames})` }
            </span>
          </button>
        </li>
        <li className="trashbin__option">
          <button
            type="button"
            className="trashbin__button button"
            title="Download deleted images"
            disabled={trashCount.images === 0}
            onClick={downloadImages}
          >
            <span className="trashbin__button-label">
              { `Download deleted images (${trashCount.images})` }
            </span>
          </button>
        </li>
        <li className="trashbin__option">
          <button
            type="button"
            className="trashbin__button trashbin__button--sum button"
            title="Purge all"
            disabled={sum === 0}
            onClick={purgeTrash}
          >
            <span className="trashbin__button-label">
              { `Purge all (${sum})` }
            </span>
          </button>
        </li>
      </ul>
    </Lightbox>
  );
}

export default Trashbin;
