import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';
import unique from '../../../tools/unique';
import { FILTER_FAVOURITE } from '../../../consts/specialTags';

const TagsSelect = (props) => {

  const [newTag, setNewTag] = useState('');

  const addNewTag = (tag) => {
    if (!tag) {
      return;
    }

    props.updateTags('add', tag);
    setNewTag('');
  };

  const tags = unique([...props.tags.initial, ...props.tags.add]);

  return (
    <ul className="tags-select">
      {
        tags.map((tag) => (
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
              {tag === FILTER_FAVOURITE ? '❤️' : tag}
            </span>
          </li>
        ))
      }
      <li
        className="tags-select__tag tags-select__tag--input"
      >
        <input
          type="text"
          className="tags-select__tag-name"
          onChange={({ target: { value } }) => {
            setNewTag(value);
          }}
          onBlur={({ target: { value } }) => {
            addNewTag(value);
          }}
          onKeyUp={(ev) => {
            switch (ev.key) {
              case 'Tab':
              case 'Enter':
                addNewTag(ev.target.value);
                break;
              default:
                break;
            }
          }}
          value={newTag}
        />
      </li>
    </ul>
  );
};

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
