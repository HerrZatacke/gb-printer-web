import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

const FilterFormTag = ({ tagActive, toggleTag, title }) => (
  <li
    title={title}
    className={
      classnames('filter-form__tag', {
        'filter-form__tag--active': tagActive,
      })
    }
  >
    <button
      className="filter-form__tag-button"
      type="button"
      onClick={() => toggleTag(tagActive ? 'remove' : 'add')}
    >
      <SVG name="checkmark" />
      <span className="filter-form__tag-text">{title}</span>
    </button>
  </li>
);

FilterFormTag.propTypes = {
  title: PropTypes.string.isRequired,
  tagActive: PropTypes.bool.isRequired,
  toggleTag: PropTypes.func.isRequired,
};

export default FilterFormTag;
