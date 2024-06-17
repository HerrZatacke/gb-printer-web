import React from 'react';
import classnames from 'classnames';
import SVG from '../SVG';
import { GalleryViews } from '../../../consts/GalleryViews';

import './index.scss';
import { useGalleryView } from './useGalleryView';

const GALLERY_VIEWS = [
  GalleryViews.GALLERY_VIEW_LIST,
  GalleryViews.GALLERY_VIEW_1X,
  GalleryViews.GALLERY_VIEW_2X,
  GalleryViews.GALLERY_VIEW_3X,
  GalleryViews.GALLERY_VIEW_4X,
];

function GalleryViewSelect() {
  const {
    currentView,
    updateView,
  } = useGalleryView();

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
