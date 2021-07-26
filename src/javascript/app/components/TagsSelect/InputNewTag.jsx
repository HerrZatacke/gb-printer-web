import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useCombobox } from 'downshift';
import { useAvailableTags } from '../../../hooks/useAvailableTags';

const InputNewTag = ({ updateTags, selectedTags }) => {
  const { availableTags } = useAvailableTags();
  const [inputItems, setInputItems] = useState([]);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    reset,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        availableTags
          .filter((tag) => (
            tag.toLowerCase().startsWith(inputValue.trim().toLowerCase())
          ))
          .filter((tag) => !selectedTags.includes(tag)),
      );
    },
  });

  const addNewTag = (tag) => {
    if (!tag) {
      return;
    }

    updateTags('add', tag);
    reset();
  };

  return (
    <li
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...getComboboxProps()}
      className="tags-select__tag tags-select__tag--input"
    >
      <input
        type="text"
        className="tags-select__tag-name"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getInputProps()}
        onKeyUp={(ev) => {
          switch (ev.key) {
            case 'Enter':
              addNewTag(ev.target.value);
              break;
            default:
              break;
          }
        }}
      />
      <ul
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getMenuProps()}
        className={
          classnames('tags-select__combo-box', {
            'tags-select__combo-box--open': isOpen,
          })
        }
      >
        {isOpen &&
        inputItems
          .map((item, index) => (
            <li
              className={
                classnames('tags-select__combo-box-item', {
                  'tags-select__combo-box-item--selected': highlightedIndex === index,
                })
              }
              key={`${item}${index}`}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...getItemProps({ item, index })}
            >
              {item}
            </li>
          ))}
      </ul>
    </li>
  );
};

InputNewTag.propTypes = {
  updateTags: PropTypes.func.isRequired,
  selectedTags: PropTypes.array.isRequired,
};

export default InputNewTag;
