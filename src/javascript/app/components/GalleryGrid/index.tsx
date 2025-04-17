import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import type { CSSPropertiesVars, PropsWithChildren } from 'react';
import useSettingsStore from '../../stores/settingsStore';
import { useScreenDimensions } from '../../../hooks/useScreenDimensions';
import { GalleryViews } from '../../../consts/GalleryViews';

function GalleryGrid({ children }: PropsWithChildren) {
  const screenDimensions = useScreenDimensions();
  const { galleryView } = useSettingsStore();

  const styleVariables = useMemo<CSSPropertiesVars>(() => {
    let imageSize = '';
    let gap = '';
    let columns = '';

    switch (galleryView) {
      case GalleryViews.GALLERY_VIEW_SMALL: {
        const gapNumber = 16 / screenDimensions.ddpx;
        const imageSizeNumber = 160 / screenDimensions.ddpx;
        imageSize = `${imageSizeNumber}px`;
        gap = `${gapNumber}px`;
        columns = Math.floor((screenDimensions.layoutWidth + gapNumber) / (imageSizeNumber + gapNumber)).toString(10);
        break;
      }

      case GalleryViews.GALLERY_VIEW_1X: {
        imageSize = '160px';
        gap = 'var(--1x-gap)';
        columns = 'var(--1x-columns)';
        break;
      }

      case GalleryViews.GALLERY_VIEW_2X: {
        imageSize = '320px';
        gap = 'var(--2x-gap)';
        columns = 'var(--2x-columns)';
        break;
      }

      case GalleryViews.GALLERY_VIEW_MAX: {
        imageSize = `${screenDimensions.layoutWidth}px`;
        gap = 'var(--max-gap)';
        columns = 'var(--max-columns)';
        break;
      }

      default:
        break;
    }

    return {
      '--image-size': imageSize,
      '--columns': columns,
      '--layout-width': `${screenDimensions.layoutWidth}px`,
      gap,
      display: 'grid',
      margin: '0 auto',
      padding: '16px 0',
      gridTemplateColumns: 'repeat(var(--columns), var(--image-size))',
      width: 'calc((var(--image-size) * var(--columns)) + (var(--gap) * (var(--columns) - 1)))',
    };
  }, [galleryView, screenDimensions]);

  return (
    <Box
      component="ul"
      sx={styleVariables}
    >
      {children}
    </Box>
  );
}

export default GalleryGrid;
