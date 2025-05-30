import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useMemo, useCallback } from 'react';
import Debug from '@/components/Debug';
import GalleryGridItem from '@/components/GalleryGridItem';
import GalleryImageContextMenu from '@/components/GalleryImageContextMenu';
import ImageRender from '@/components/ImageRender';
import TagsList from '@/components/TagsList';
import { GalleryClickAction } from '@/consts/GalleryClickAction';
import { useDateFormat } from '@/hooks/useDateFormat';
import { useGalleryImage } from '@/hooks/useGalleryImage';
import { useGalleryImageContext } from '@/hooks/useGalleryImageContext';
import { ImageSelectionMode } from '@/stores/filtersStore';
import useSettingsStore from '@/stores/settingsStore';
import type { RGBNHashes } from '@/types/Image';

dayjs.extend(customParseFormat);

interface Props {
  hash: string,
  page: number,
}

function GalleryImage({ page, hash }: Props) {
  const { enableDebug, galleryClickAction } = useSettingsStore();

  const {
    galleryImageData,
    updateImageSelection,
  } = useGalleryImage(hash);

  const {
    setLightboxImage,
    editImage,
  } = useGalleryImageContext(hash);

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

  const handleCellClick = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault();

    if (ev.ctrlKey || ev.shiftKey) {
      updateSelection(ev.shiftKey);
      return;
    }

    switch (galleryClickAction) {
      case GalleryClickAction.VIEW: {
        setLightboxImage();
        break;
      }

      case GalleryClickAction.EDIT: {
        editImage();
        break;
      }

      case GalleryClickAction.SELECT:
      default: {
        updateSelection(ev.shiftKey);
        break;
      }
    }
  }, [editImage, galleryClickAction, setLightboxImage, updateSelection]);

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
