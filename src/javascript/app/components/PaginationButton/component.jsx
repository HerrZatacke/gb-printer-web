import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const PaginationButton = (props) => (
  <li
    className={props.className}
  >
    <NavLink
      className="pagination__link"
      to={`/gallery/page/${props.page + 1}`}
      disabled={props.disabled}
      title={props.title}
    >
      {props.children}
    </NavLink>
  </li>
);

PaginationButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  page: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

PaginationButton.defaultProps = {
  className: null,
  disabled: false,
};

export default PaginationButton;
