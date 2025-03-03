import React, { useMemo } from 'react';
import PaginationButton from '../PaginationButton';
import SVG from '../SVG';
import { useGalleryTreeContext } from '../../contexts/galleryTree';
import useSettingsStore from '../../stores/settingsStore';
import useFiltersStore from '../../stores/filtersStore';
import getFilteredImagesCount from '../../../tools/getFilteredImages/count';
import './index.scss';

interface Props {
  page: number
}

function Pagination({ page }: Props) {
  const { view } = useGalleryTreeContext();
  const { pageSize } = useSettingsStore();
  const { filtersActiveTags, recentImports } = useFiltersStore();

  const SKIP_STEP = 5;

  const maxPageIndex = useMemo(() => (
    pageSize ?
      Math.ceil(getFilteredImagesCount(view.images, filtersActiveTags, recentImports) / pageSize) - 1 :
      0
  ), [filtersActiveTags, pageSize, recentImports, view]);

  if (maxPageIndex === 0) {
    return null;
  }

  const buttons = [
    {
      icon: 'left',
      pageIndex: page - 1,
      disabled: page < 1,
    },
    null,
    {
      icon: 'right',
      pageIndex: page + 1,
      disabled: maxPageIndex < page + 1,
    },
  ];

  if (maxPageIndex > SKIP_STEP) {
    buttons.unshift({
      icon: 'doubleleft',
      pageIndex: page - SKIP_STEP,
      disabled: page < SKIP_STEP,
    });
    buttons.push({
      icon: 'doubleright',
      pageIndex: page + SKIP_STEP,
      disabled: maxPageIndex < page + SKIP_STEP,
    });
  }

  if (maxPageIndex > 1) {
    buttons.unshift({
      icon: 'allleft',
      pageIndex: 0,
      disabled: page === 0,
    });
    buttons.push({
      icon: 'allright',
      pageIndex: maxPageIndex,
      disabled: page === maxPageIndex,
    });
  }

  return (
    <ul className="pagination gallery-button__group">
      {buttons.map((button) => {
        if (!button) {
          return (
            <li
              key="current"
              className="pagination__current"
            >
              { `${page + 1}/${maxPageIndex + 1}` }
            </li>
          );
        }

        const { icon, pageIndex, disabled } = button;
        return (
          <PaginationButton
            key={icon}
            page={pageIndex}
            disabled={disabled}
          >
            <SVG name={icon} />
          </PaginationButton>
        );
      })}
    </ul>
  );
}

export default Pagination;
