import AppsIcon from '@mui/icons-material/Apps';
import SquareIcon from '@mui/icons-material/Square';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import WindowSharpIcon from '@mui/icons-material/WindowSharp';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import React from 'react';
import { GalleryViews } from '@/consts/GalleryViews';
import { useScreenDimensions } from '@/hooks/useScreenDimensions';
import useSettingsStore from '@/stores/settingsStore';

const viewName = (id: GalleryViews): string => {
  switch (id) {
    case GalleryViews.GALLERY_VIEW_SMALL:
      return 'viewNames.smallest';
    case GalleryViews.GALLERY_VIEW_1X:
      return 'viewNames.originalSize';
    case GalleryViews.GALLERY_VIEW_2X:
      return 'viewNames.doubleSize';
    case GalleryViews.GALLERY_VIEW_MAX:
      return 'viewNames.maximumSize';
    default:
      return '';
  }
};

const viewIcon = (view: GalleryViews): ReactNode => {
  switch (view) {
    case GalleryViews.GALLERY_VIEW_SMALL:
      return <ViewCompactIcon />;
    case GalleryViews.GALLERY_VIEW_1X:
      return <AppsIcon />;
    case GalleryViews.GALLERY_VIEW_2X:
      return <WindowSharpIcon />;
    case GalleryViews.GALLERY_VIEW_MAX:
    default:
      return <SquareIcon />;
  }
};

function GalleryViewSelect() {
  const t = useTranslations('GalleryViewSelect');
  const {
    galleryView,
    setGalleryView,
  } = useSettingsStore();

  const { ddpx } = useScreenDimensions();

  const GALLERY_VIEWS = ddpx > 1 ? [
    GalleryViews.GALLERY_VIEW_SMALL,
    GalleryViews.GALLERY_VIEW_1X,
    GalleryViews.GALLERY_VIEW_2X,
    GalleryViews.GALLERY_VIEW_MAX,
  ] : [
    GalleryViews.GALLERY_VIEW_1X,
    GalleryViews.GALLERY_VIEW_2X,
    GalleryViews.GALLERY_VIEW_MAX,
  ];

  return (
    <ToggleButtonGroup
      value={galleryView}
      exclusive
      onChange={(_, value) => {
        if (value) {
          setGalleryView(value);
        }
      }}
      sx={{ '& .MuiToggleButton-root': { width: 40, height: 40 } }}
    >
      {
        GALLERY_VIEWS.map((view) => (
          <ToggleButton
            key={view}
            value={view}
            title={t(viewName(view))}
          >
            {viewIcon(view)}
          </ToggleButton>
        ))
      }
    </ToggleButtonGroup>
  );
}

export default GalleryViewSelect;
