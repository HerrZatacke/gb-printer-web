import React from 'react';
import PropTypes from 'prop-types';

const TagsSelect = (props) => (
  <div className="tags-select">
    {
      props.tags.join(',')
    }
    {
      JSON.stringify(props.batchTags, null, 2)
    }
  </div>
);

TagsSelect.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  batchTags: PropTypes.shape({
    initial: PropTypes.array.isRequired,
    add: PropTypes.array.isRequired,
    remove: PropTypes.array.isRequired,
  }),
};

TagsSelect.defaultProps = {
  batchTags: null,
};

export default TagsSelect;
