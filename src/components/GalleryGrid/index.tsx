import Box from '@mui/material/Box';
import React, { useMemo } from 'react';
import type { CSSPropertiesVars, PropsWithChildren } from 'react';
import { GalleryViews } from '@/consts/GalleryViews';
import { useScreenDimensions } from '@/hooks/useScreenDimensions';
import useSettingsStore from '@/stores/settingsStore';

interface Props extends PropsWithChildren {
  fixedView?: GalleryViews,
}

function GalleryGrid({ fixedView, children }: Props) {
  const { ddpx } = useScreenDimensions();
  const { galleryView } = useSettingsStore();

  const usedView = fixedView || galleryView;

  const styleVariables = useMemo<CSSPropertiesVars>(() => {
    let imageSize = '';
    let gap = '';

    // if ddpx is 1, but responsive view is selected, switch to 1x view
    const checkView = (
      usedView === GalleryViews.GALLERY_VIEW_SMALL &&
      ddpx === 1
    ) ? GalleryViews.GALLERY_VIEW_1X :
      usedView;

    switch (checkView) {
      case GalleryViews.GALLERY_VIEW_SMALL: {
        imageSize = `${160 / ddpx}px`;
        gap = `${8 / ddpx}px`;
        break;
      }

      case GalleryViews.PALETTE_VIEW: {
        imageSize = 'minmax(270px, 1fr)';
        gap = '32px';
        break;
      }

      case GalleryViews.GALLERY_VIEW_1X: {
        imageSize = '160px';
        gap = '16px';
        break;
      }

      case GalleryViews.GALLERY_VIEW_2X: {
        imageSize = '320px';
        gap = '32px';
        break;
      }

      case GalleryViews.GALLERY_VIEW_MAX: {
        imageSize = '100%';
        gap = '32px';
        break;
      }

      default:
        break;
    }

    return {
      gap,
      display: 'grid',
      justifyContent: 'center',
      gridTemplateColumns: `repeat(auto-fill, ${imageSize})`,
    };
  }, [usedView, ddpx]);

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
