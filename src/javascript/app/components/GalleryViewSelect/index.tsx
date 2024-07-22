import React from 'react';
import classnames from 'classnames';
import SVG from '../SVG';
import { GalleryViews } from '../../../consts/GalleryViews';
import { useGalleryView } from './useGalleryView';
import { useScreenDimensions } from '../../../hooks/useScreenDimensions';

import './index.scss';

const viewName = (id: GalleryViews): string => {
  switch (id) {
    case GalleryViews.GALLERY_VIEW_SMALL:
      return 'Smallest';
    case GalleryViews.GALLERY_VIEW_1X:
      return 'Original Size';
    case GalleryViews.GALLERY_VIEW_2X:
      return 'Double Size';
    case GalleryViews.GALLERY_VIEW_MAX:
      return 'Maximum Size';
    default:
      return '';
  }
};

function GalleryViewSelect() {
  const {
    currentView,
    updateView,
  } = useGalleryView();

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
    <ul className="gallery-view-select gallery-button__group">
      {
        GALLERY_VIEWS.map((view) => (
          <li
            key={view}
            className={
              classnames('gallery-button gallery-button--enabled', {
                'gallery-button--selected': currentView === view,
              })
            }
          >
            <button
              type="button"
              onClick={() => {
                updateView(view);
              }}
              title={viewName(view)}
            >
              <SVG name={view} />
            </button>
          </li>
        ))
      }
    </ul>
  );
}

export default GalleryViewSelect;
