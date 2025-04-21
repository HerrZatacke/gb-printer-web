import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import { blend } from '@mui/system';
import type { Theme } from '@mui/system';
import { Link } from 'react-router';
import ImageRender from '../ImageRender';
import TagsList from '../TagsList';
import GalleryGroupContextMenu from '../GalleryGroupContextMenu';
import GalleryGridItem from '../GalleryGridItem';
import { useGalleryGroup } from './useGalleryGroup';
import { useGalleryImage } from '../GalleryImage/useGalleryImage';
import useSettingsStore from '../../stores/settingsStore';
import { GalleryViews } from '../../../consts/GalleryViews';

interface Props {
  hash: string,
}

function GalleryGroup({ hash }: Props) {
  const { group, path } = useGalleryGroup(hash);
  const { galleryImageData } = useGalleryImage(hash);
  const { galleryView } = useSettingsStore();

  const canvasStyles = useMemo(() => {
    switch (galleryView) {
      case GalleryViews.GALLERY_VIEW_SMALL:
      case GalleryViews.GALLERY_VIEW_1X:
        return {
          transform: 'scale(0.5)',
          imageRendering: 'auto !important',
        };

      default:
        return { transform: 'scale(0.5)' };
    }
  }, [galleryView]);

  if (!galleryImageData || !group) {
    return null;
  }

  const {
    hashes,
    palette,
    invertPalette,
    framePalette,
    frame,
    lockFrame,
    rotation,
  } = galleryImageData;

  return (
    <GalleryGridItem
      selectionText=""
      title={group.title}
      subheader={`${group.images.length} items`}
      wrapperProps={{
        component: Link,
        to: `/gallery/${path}page/1`,
        sx: {
          textDecoration: 'none',
        },
      }}
      contextMenuComponent={GalleryGroupContextMenu}
      contextMenuProps={{
        groupId: group.id,
      }}
      media={(
        <Box
          sx={{
            position: 'relative',
            margin: '0 auto',

            '& > .MuiBox-root': {
              position: 'absolute',
              top: 0,

              canvas: canvasStyles,
            },
          }}
        >
          <SvgIcon
            viewBox="0 0 24 21"
            color="secondary"
            sx={(theme: Theme) => ({
              width: '100%',
              height: '100%',
              fill: blend(theme.palette.secondary.main, theme.palette.fgtext.main, 0.25),
            })}
          >
            <path d="M 10,2 H 4 C 2.9,2 2.01,2.9 2.01,4 L 2,16 c 0,1.1 0.9,2 2,2 h 16 c 1.1,0 2,-0.9 2,-2 V 6 C 22,4.9 21.1,4 20,4 h -8 z" />
          </SvgIcon>
          <ImageRender
            lockFrame={lockFrame}
            invertPalette={invertPalette}
            framePalette={framePalette}
            palette={palette}
            frameId={frame}
            hash={hash}
            hashes={hashes}
            rotation={rotation}
          />
        </Box>
      )}
      content={group.tags.length > 0 && (
        <TagsList tags={group.tags} fromGroup />
      )}
    />
  );
}

export default GalleryGroup;
