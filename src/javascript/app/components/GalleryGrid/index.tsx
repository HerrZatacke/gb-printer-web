import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import type { CSSPropertiesVars, PropsWithChildren } from 'react';
import useSettingsStore from '../../stores/settingsStore';
import { useScreenDimensions } from '../../../hooks/useScreenDimensions';
import { GalleryViews } from '../../../consts/GalleryViews';

interface Props extends PropsWithChildren {
  fixedView?: GalleryViews,
}

function GalleryGrid({ fixedView, children }: Props) {
  const screenDimensions = useScreenDimensions();
  const { galleryView } = useSettingsStore();

  const usedView = fixedView || galleryView;

  const styleVariables = useMemo<CSSPropertiesVars>(() => {
    let imageSize = '';
    let gap = '';
    let columns = '';
    let width = 'auto';

    switch (usedView) {
      case GalleryViews.GALLERY_VIEW_SMALL: {
        const gapNumber = 16 / screenDimensions.ddpx;
        const imageSizeNumber = 160 / screenDimensions.ddpx;
        imageSize = `${imageSizeNumber}px`;
        gap = `${gapNumber}px`;
        columns = Math.floor((screenDimensions.layoutWidth + gapNumber) / (imageSizeNumber + gapNumber)).toString(10);
        break;
      }

      case GalleryViews.PALETTE_VIEW: {
        imageSize = '1fr';
        gap = '32px';
        columns = Math.floor(screenDimensions.layoutWidth / 290).toString(10);
        width = '100%';
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
      gap,
      display: 'grid',
      margin: '0 auto',
      padding: '16px 0',
      gridTemplateColumns: `repeat(${columns}, ${imageSize})`,
      width,
    };
  }, [usedView, screenDimensions]);

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
