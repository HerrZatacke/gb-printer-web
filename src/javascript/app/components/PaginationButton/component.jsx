import React from 'react';
import PropTypes from 'prop-types';

const PaginationButton = (props) => (
  <li
    className={props.className}
  >
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.disabled ? null : props.action}
      title={props.title}
    >
      {props.children}
    </button>
  </li>
);

PaginationButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  action: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

PaginationButton.defaultProps = {
  className: null,
  disabled: false,
};

export default PaginationButton;
