import React from 'react';
import dayjs from 'dayjs';
import GameBoyImage from '../../GameBoyImage';
import SVG from '../../SVG';
import dateFormatLocale from '../../../../tools/dateFormatLocale';
import type { ImportItem } from '../../../../../types/ImportItem';
import useImportsStore from '../../../stores/importsStore';
import useItemsStore from '../../../stores/itemsStore';
import useSettingsStore from '../../../stores/settingsStore';

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
    tempId,
  } = importItem;

  const { palettes, images } = useItemsStore();
  const palette = palettes.find(({ shortName }) => shortName === paletteShort);
  const storeDuplicateImage = images.find(({ hash }) => hash === imageHash);

  const { importQueue } = useImportsStore();
  const queueDuplicates = importQueue.filter((item) => item.imageHash === imageHash).length;

  const { preferredLocale } = useSettingsStore();

  const { frameQueueAdd, importQueueCancelOne } = useImportsStore();

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
            imageStartLine={2}
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
              { dateFormatLocale(dayjs(lastModified), preferredLocale) }
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
      </div>
      <div className="import-image__buttons">
        <button
          className="import-image__button import-image__button--frame"
          type="button"
          title="Import as Frame"
          disabled={tiles.length / 20 < 14}
          onClick={() => frameQueueAdd([importItem])}
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
          onClick={() => importQueueCancelOne(tempId)}
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
