import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import OldLightbox from '../../Lightbox';

import './index.scss';
import { useSortForm } from './useSortForm';
import { SortDirection } from '../../../../tools/sortby';

interface Sortable {
  title: string,
  key: string,
}

const sortables: Sortable[] = [
  {
    title: 'Title',
    key: 'title',
  },
  {
    title: 'Date',
    key: 'created',
  },
  {
    title: 'Palette',
    key: 'palette',
  },
];

function SortForm() {
  const sortForm = useSortForm();

  const [sortBy, setSortBy] = useState<string>(sortForm.sortBy);
  const [sortOrder, setSortOrder] = useState<SortDirection>(sortForm.sortOrder);

  useEffect(() => {
    setSortBy(sortForm.sortBy);
    setSortOrder(sortForm.sortOrder);
  }, [setSortBy, setSortOrder, sortForm.visible, sortForm.sortBy, sortForm.sortOrder]);

  if (!sortForm.visible) {
    return null;
  }

  const currentSortBy = sortables.find(({ key }) => (key === sortBy)) || sortables[0];
  const currentOrderLabel = sortOrder === SortDirection.ASC ? 'ascending' : 'descending';

  return (
    <OldLightbox
      className="sort-form"
      confirm={() => sortForm.setSortBy(`${sortBy}_${sortOrder}`)}
      deny={() => {
        sortForm.hideSortForm();
      }}
      header={`Sort by: ${currentSortBy.title}/${currentOrderLabel}`}
    >
      <ul
        className="sort-form__list"
      >
        { sortables.map(({ key, title }) => (
          <li key={key}>
            <button
              className={
                classNames('sort-form__button', {
                  'sort-form__button--selected': sortBy === key,
                })
              }
              type="button"
              onClick={() => setSortBy(key)}
            >
              { title }
            </button>
          </li>
        )) }
      </ul>

      <ul
        className="sort-form__list"
      >
        <li>
          <button
            className={
              classNames('sort-form__button sort-form__button--order-asc', {
                'sort-form__button--selected': sortOrder === 'asc',
              })
            }
            type="button"
            onClick={() => setSortOrder(SortDirection.ASC)}
          >
            Ascending
          </button>
        </li>
        <li>
          <button
            className={
              classNames('sort-form__button sort-form__button--order-desc', {
                'sort-form__button--selected': sortOrder === 'desc',
              })
            }
            type="button"
            onClick={() => setSortOrder(SortDirection.DESC)}
          >
            Descending
          </button>
        </li>
      </ul>
    </OldLightbox>
  );
}

export default SortForm;
