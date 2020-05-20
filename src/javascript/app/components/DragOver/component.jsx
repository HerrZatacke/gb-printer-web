import React from 'react';
import PropTypes from 'prop-types';

const DragOver = (props) => (
  props.dragover ? (
    <div className="drag-over" />
  ) : null
);

DragOver.propTypes = {
  dragover: PropTypes.bool.isRequired,
};

DragOver.defaultProps = {};

export default DragOver;
