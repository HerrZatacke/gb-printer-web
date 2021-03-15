import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Lightbox from '../../Lightbox';

const sortables = [
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

const SortForm = (props) => {
  const [sortBy, setSortBy] = useState(props.sortBy);
  const [sortOrder, setSortOrder] = useState(props.sortOrder);

  useEffect(() => {
    setSortBy(props.sortBy);
    setSortOrder(props.sortOrder);
  }, [setSortBy, setSortOrder, props.visible, props.sortBy, props.sortOrder]);

  if (!props.visible) {
    return null;
  }

  const currentSortBy = sortables.find(({ key }) => (key === sortBy));
  const currentOrderTitle = sortOrder === 'asc' ? 'ascending' : 'descending';

  return (
    <Lightbox
      className="sort-form"
      confirm={() => props.setSortBy(`${sortBy}_${sortOrder}`)}
      deny={() => {
        props.hideSortForm();
      }}
      header={`Sort by: ${currentSortBy.title}/${currentOrderTitle}`}
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
            onClick={() => setSortOrder('asc')}
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
            onClick={() => setSortOrder('desc')}
          >
            Descending
          </button>
        </li>
      </ul>
    </Lightbox>
  );
};

SortForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  hideSortForm: PropTypes.func.isRequired,
};

SortForm.defaultProps = {};

export default SortForm;
