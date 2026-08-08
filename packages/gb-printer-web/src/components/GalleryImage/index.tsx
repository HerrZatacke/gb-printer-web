import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { type RGBNHashes } from 'gb-printer-schemas';
import React, { useMemo, useCallback } from 'react';
import Debug from '@/components/Debug';
import GalleryGridItem from '@/components/GalleryGridItem';
import GalleryImageContextMenu from '@/components/GalleryImageContextMenu';
import ImageRender from '@/components/ImageRender';
import TagsList from '@/components/TagsList';
import { GalleryClickAction } from '@/consts/GalleryClickAction';
import { useDateFormat } from '@/hooks/useDateFormat';
import { useGalleryImage } from '@/hooks/useGalleryImage';
import { useGalleryImageContextMenu } from '@/hooks/useGalleryImageContextMenu';
import { ImageSelectionMode, useSettingsStore } from '@/stores/stores';

dayjs.extend(customParseFormat);

interface Props {
  hash: string;
}

function GalleryImage({ hash }: Props) {
  const { enableDebug, galleryClickAction } = useSettingsStore();

  const {
    galleryImageData,
    updateImageSelection,
  } = useGalleryImage(hash);

  const {
    setLightboxImage,
    editImage,
  } = useGalleryImageContextMenu(hash);

  const { formatterGallery } = useDateFormat();

  const debugText = useMemo<string>(() => ([
    hash,
    ...(galleryImageData?.hashes ? Object.keys(galleryImageData.hashes).map((channel) => (
      `${channel.toUpperCase()}: ${galleryImageData.hashes?.[channel as keyof RGBNHashes]}`
    )) : []),
  ]
    .filter(Boolean)
    .join('\n')
  ), [galleryImageData, hash]);

  const updateSelection = useCallback(async (shift: boolean) => {
    await updateImageSelection(
      galleryImageData?.selectionIndex !== -1 ? ImageSelectionMode.REMOVE : ImageSelectionMode.ADD,
      shift,
    );
  }, [galleryImageData, updateImageSelection]);

  const handleCellClick = useCallback(async (ev: React.MouseEvent) => {
    ev.preventDefault();

    if (ev.ctrlKey || ev.shiftKey) {
      await updateSelection(ev.shiftKey);
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
        await updateSelection(ev.shiftKey);
        break;
      }
    }
  }, [editImage, galleryClickAction, setLightboxImage, updateSelection]);

  if (!galleryImageData) {
    return null;
  }

  const {
    created,
    title,
    tags,
    selectionIndex,
  } = galleryImageData;

  return (
    <GalleryGridItem
      selectionText={selectionIndex !== -1 ? (selectionIndex + 1).toString(10) : ''}
      title={title}
      subheader={formatterGallery(created)}
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
        <ImageRender hash={hash} />
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
