import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';
import InputNewTag from './InputNewTag';
import unique from '../../../tools/unique';
import { FILTER_FAVOURITE } from '../../../consts/specialTags';
import './index.scss';

const TagsSelect = ({
  label,
  tags,
  updateTags,
  listDirection,
}) => {
  const activeTags = unique([...tags.initial, ...tags.add]);

  return (
    <>
      {(
        label ? (
          <label
            className="tags-select__label"
            htmlFor="tags-select-new-tag"
          >
            { label }
          </label>
        ) : null
      )}
      <ul className="tags-select">
        {
          activeTags.map((tag) => (
            <li
              className={
                classnames('tags-select__tag', {
                  'tags-select__tag--add': tags.add.includes(tag),
                  'tags-select__tag--remove': tags.remove.includes(tag),
                })
              }
              key={tag}
            >
              <span
                className="tags-select__tag-name"
              >
                {tag === FILTER_FAVOURITE ? '❤️' : tag}
              </span>
              <button
                type="button"
                className="tags-select__button tags-select__button--remove"
                onClick={() => updateTags('remove', tag)}
              >
                <SVG name="remove" />
              </button>
              <button
                type="button"
                className="tags-select__button tags-select__button--add"
                onClick={() => updateTags('add', tag)}
              >
                <SVG name="add" />
              </button>
            </li>
          ))
        }
        <InputNewTag
          updateTags={updateTags}
          selectedTags={activeTags}
          direction={listDirection}
        />
      </ul>
    </>
  );
};

TagsSelect.propTypes = {
  tags: PropTypes.shape({
    initial: PropTypes.array.isRequired,
    add: PropTypes.array.isRequired,
    remove: PropTypes.array.isRequired,
  }).isRequired,
  updateTags: PropTypes.func.isRequired,
  label: PropTypes.string,
  listDirection: PropTypes.string,
};

TagsSelect.defaultProps = {
  label: false,
  listDirection: 'down',
};

export default TagsSelect;
