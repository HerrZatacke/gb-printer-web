import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

const TagsSelect = (props) => (
  <ul className="tags-select">
    {
      props.tags.initial.map((tag) => (
        <li
          className={
            classnames('tags-select__tag', {
              'tags-select__tag--add': props.tags.add.includes(tag),
              'tags-select__tag--remove': props.tags.remove.includes(tag),
            })
          }
          key={tag}
        >
          <button
            type="button"
            className="tags-select__button tags-select__button--add"
            onClick={() => props.updateTags('add', tag)}
          >
            <SVG name="add" />
          </button>
          <button
            type="button"
            className="tags-select__button tags-select__button--remove"
            onClick={() => props.updateTags('remove', tag)}
          >
            <SVG name="remove" />
          </button>
          <span
            className="tags-select__tag-name"
          >
            {tag}
          </span>
        </li>
      ))
    }
  </ul>
);

TagsSelect.propTypes = {
  tags: PropTypes.shape({
    initial: PropTypes.array.isRequired,
    add: PropTypes.array.isRequired,
    remove: PropTypes.array.isRequired,
  }).isRequired,
  updateTags: PropTypes.func.isRequired,
};

TagsSelect.defaultProps = {};

export default TagsSelect;
