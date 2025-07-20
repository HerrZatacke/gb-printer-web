import type { RGBNPalette } from 'gb-image-decoder';
import { useTranslations } from 'next-intl';
import React from 'react';
import Debug from '@/components/Debug';
import FrameContextMenu from '@/components/FrameContextMenu';
import GalleryGridItem from '@/components/GalleryGridItem';
import GameBoyImage from '@/components/GameBoyImage';
import ImageLoading from '@/components/ImageLoading';
import useFrame from '@/hooks/useFrame';
import useSettingsStore from '@/stores/settingsStore';

interface Props {
  frameId: string,
  name: string,
  palette: string[] | RGBNPalette,
}

function Frame({ frameId, name, palette }: Props) {
  const t = useTranslations('Frame');
  const { enableDebug } = useSettingsStore();

  const {
    tiles,
    deleteFrame,
    editFrame,
    frameHash,
    imageStartLine,
    usage,
  } = useFrame({ frameId, name });

  if (!tiles) {
    return null;
  }

  const usageText = usage ? t('usedTimes', { count: usage }) : t('notUsed');

  return (
    <GalleryGridItem
      selectionText=""
      title={name}
      subheader={`(${frameId}) ${usageText}`}
      wrapperProps={{
        onClick: editFrame,
        disableRipple: true,
        sx: {
          display: 'block',
          width: '100%',
          textAlign: 'left',
        },
      }}
      contextMenuComponent={FrameContextMenu}
      contextMenuProps={{ deleteFrame, editFrame }}
      media={tiles.length ? (
        <GameBoyImage
          lockFrame={false}
          invertPalette={false}
          palette={palette}
          imageStartLine={imageStartLine}
          tiles={tiles}
        />
      ) : (
        <ImageLoading />
      )}
      content={enableDebug && <Debug text={frameHash} />}
    />
  );
}

export default Frame;
