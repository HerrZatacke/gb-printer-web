import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useCombobox } from 'downshift';
import SVG from '../SVG';
import { useAvailableTags } from '../../../hooks/useAvailableTags';

const InputNewTag = ({ updateTags, selectedTags }) => {
  const { availableTags } = useAvailableTags();
  const selectableTags = availableTags.filter((tag) => !selectedTags.includes(tag));
  const [inputItems, setInputItems] = useState(selectableTags);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getToggleButtonProps,
    highlightedIndex,
    getItemProps,
    reset,
    inputValue: currentValue,
  } = useCombobox({
    items: inputItems,

    onSelectedItemChange: ({ inputValue }) => {
      if (inputValue.trim()) {
        updateTags('add', inputValue.trim());
        reset();
      }
    },

    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        selectableTags
          .filter((tag) => (
            tag.toLowerCase().startsWith(inputValue.trim().toLowerCase())
          )),
      );
    },
  });

  const addNewTag = () => {
    if (currentValue.trim()) {
      updateTags('add', currentValue.trim());
      reset();
    }
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
        id="tags-select-new-tag"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getInputProps()}
        onKeyUp={(ev) => {
          switch (ev.key) {
            case 'Enter':
              addNewTag();
              break;
            default:
              break;
          }
        }}
      />
      <button
        type="button"
        className="tags-select__button tags-select__button--add tags-select__button--only-touch"
        onClick={addNewTag}
      >
        <SVG name="add" />
      </button>
      <button
        type="button"
        className="tags-select__combo-box-toggle-button"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getToggleButtonProps()}
        aria-label="toggle tag select menu"
      >
        <SVG name="arrowdown" />
      </button>
      <ul
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getMenuProps()}
        className={
          classnames('tags-select__combo-box-list', {
            'tags-select__combo-box-list--open': isOpen,
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
