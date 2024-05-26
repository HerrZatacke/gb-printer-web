import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import GameBoyImage from '../../GameBoyImage';
import SVG from '../../SVG';
import { Actions } from '../../../store/actions';
import dateFormatLocale from '../../../../tools/dateFormatLocale';
import { State } from '../../../store/State';
import { ImportItem } from '../../../../../types/ImportItem';
import { FrameQueueAddAction, ImportQueueCancelOneAction } from '../../../../../types/actions/QueueActions';

interface Props {
  importItem: ImportItem,
  paletteShort: string,
}

function ImportRow({
  importItem,
  paletteShort,
}: Props) {
  const {
    tiles,
    fileName,
    lastModified,
    imageHash,
    frameHash,
    tempId,
  } = importItem;

  const {
    palette,
    locale,
    storeDuplicateImage,
    storeDuplicateFrame,
    queueDuplicates,
  } = useSelector((state: State) => ({
    palette: state.palettes.find(({ shortName }) => shortName === paletteShort),
    locale: state.preferredLocale,
    storeDuplicateImage: state.images.find(({ hash }) => hash === imageHash),
    storeDuplicateFrame: state.frames.find(({ hash }) => hash === frameHash),
    queueDuplicates: state.importQueue.filter((item) => item.imageHash === imageHash).length,
  }));

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
            palette={palette?.palette}
            asThumb
          />
        </span>
      </span>
      <div className="import-image__meta">
        <div className="import-image__name">
          { fileName }
        </div>
        {
          lastModified ? (
            <div className="import-image__date">
              { dateFormatLocale(dayjs(lastModified), locale) }
            </div>
          ) : null
        }
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
              dispatch<FrameQueueAddAction>({
                type: Actions.FRAMEQUEUE_ADD,
                payload: importItem,
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
            dispatch<ImportQueueCancelOneAction>({
              type: Actions.IMPORTQUEUE_CANCEL_ONE,
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

export default ImportRow;
