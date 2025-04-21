import React from 'react';
import type { RGBNPalette } from 'gb-image-decoder';
import GameBoyImage from '../GameBoyImage';
import useFrame from './useFrame';
import Debug from '../Debug';
import GalleryGridItem from '../GalleryGridItem';
import useSettingsStore from '../../stores/settingsStore';
import FrameContextMenu from '../FrameContextMenu';
import ImageLoading from '../ImageLoading';

interface Props {
  frameId: string,
  name: string,
  palette: string[] | RGBNPalette,
}

function Frame({ frameId, name, palette }: Props) {
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

  const usageText = usage ? `Used ${usage} times` : 'Not used';

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
