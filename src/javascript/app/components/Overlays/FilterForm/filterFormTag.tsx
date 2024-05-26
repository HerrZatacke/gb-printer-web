import React from 'react';
import classnames from 'classnames';
import SVG from '../../SVG';
import { ActiveTagUpdateMode } from './useFilterForm';

interface Props {
  title: string,
  tagActive: boolean,
  toggleTag: (mode: ActiveTagUpdateMode) => void,
  icon?: string,
}

const FilterFormTag = ({ tagActive, toggleTag, title, icon }: Props) => (
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
      onClick={() => toggleTag(tagActive ? ActiveTagUpdateMode.REMOVE : ActiveTagUpdateMode.ADD)}
    >
      <SVG name={icon || 'checkmark'} />
      <span className="filter-form__tag-text">{title}</span>
    </button>
  </li>
);

export default FilterFormTag;
