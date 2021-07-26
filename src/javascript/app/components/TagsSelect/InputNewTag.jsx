import React, { useState } from 'react';
import PropTypes from 'prop-types';

const InputNewTag = ({ updateTags }) => {

  const [newTag, setNewTag] = useState('');

  const addNewTag = (tag) => {
    if (!tag) {
      return;
    }

    updateTags('add', tag);
    setNewTag('');
  };

  return (
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
  );
};

InputNewTag.propTypes = {
  updateTags: PropTypes.func.isRequired,
};

export default InputNewTag;
