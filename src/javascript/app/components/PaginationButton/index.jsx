import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import './index.scss';

const PaginationButton = (props) => (
  <li
    className={classNames('gallery-button pagination__button', {
      'gallery-button--selected': props.active,
    })}
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
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  page: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

PaginationButton.defaultProps = {
  active: false,
  disabled: false,
};

export default PaginationButton;
