import React, { useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import GalleryImageContextMenu from '../GalleryImageContextMenu';
import ImageRender from '../ImageRender';
import Debug from '../Debug';
import TagsList from '../TagsList';
import { useGalleryImage } from './useGalleryImage';
import { useDateFormat } from '../../../hooks/useDateFormat';
import useSettingsStore from '../../stores/settingsStore';
import { ImageSelectionMode } from '../../stores/filtersStore';
import type { RGBNHashes } from '../../../../types/Image';
import GalleryGridItem from '../GalleryGridItem';

dayjs.extend(customParseFormat);

interface Props {
  hash: string,
  page: number,
}

function GalleryImage({ page, hash }: Props) {
  const { enableDebug } = useSettingsStore();

  const {
    galleryImageData,
    updateImageSelection,
  } = useGalleryImage(hash);

  const { formatter } = useDateFormat();

  const debugText = useMemo<string>(() => ([
    hash,
    ...(galleryImageData?.hashes ? Object.keys(galleryImageData.hashes).map((channel) => (
      `${channel.toUpperCase()}: ${galleryImageData.hashes?.[channel as keyof RGBNHashes]}`
    )) : []),
  ]
    .filter(Boolean)
    .join('\n')
  ), [galleryImageData, hash]);

  const updateSelection = useCallback((shift: boolean) => {
    updateImageSelection(
      galleryImageData?.selectionIndex !== -1 ? ImageSelectionMode.REMOVE : ImageSelectionMode.ADD,
      shift,
      page,
    );
  }, [galleryImageData, page, updateImageSelection]);

  if (!galleryImageData) {
    return null;
  }

  const {
    created,
    hashes,
    palette,
    invertPalette,
    invertFramePalette,
    framePalette,
    frame,
    lockFrame,
    title,
    tags,
    selectionIndex,
    rotation,
  } = galleryImageData;

  const handleCellClick = (ev: React.MouseEvent) => {
    ev.preventDefault();
    updateSelection(ev.shiftKey);
  };

  return (
    <GalleryGridItem
      selectionText={selectionIndex !== -1 ? (selectionIndex + 1).toString(10) : ''}
      title={title}
      subheader={formatter(created)}
      wrapperProps={{
        onClick: handleCellClick,
        disableRipple: true,
        sx: {
          display: 'block',
          width: '100%',
          textAlign: 'left',
        },
      }}
      contextMenuComponent={GalleryImageContextMenu}
      contextMenuProps={{ hash }}
      media={(
        <ImageRender
          lockFrame={lockFrame}
          invertPalette={invertPalette}
          palette={palette}
          framePalette={framePalette}
          invertFramePalette={invertFramePalette}
          frameId={frame}
          hash={hash}
          hashes={hashes}
          rotation={rotation}
        />
      )}
      content={(tags.length > 0 || (debugText && enableDebug)) && (
        <>
          <TagsList tags={tags} />
          <Debug text={debugText} />
        </>
      )}
    />
  );
}

export default GalleryImage;
