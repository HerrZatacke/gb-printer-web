import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navigation = (props) => (
  <nav className="navigation">
    <ul className="navigation__list">
      <li className="navigation__entry">
        <NavLink to="/" activeClassName="navigation__link--active" className="navigation__link" exact>
          Home
        </NavLink>
      </li>
      <li className="navigation__entry">
        <NavLink to="/gallery" activeClassName="navigation__link--active" className="navigation__link" exact>
          Gallery
        </NavLink>
      </li>
      <li className="navigation__entry">
        <NavLink to="/palettes" activeClassName="navigation__link--active" className="navigation__link" exact>
          Palettes
        </NavLink>
      </li>
      <li className="navigation__entry">
        <NavLink to="/settings" activeClassName="navigation__link--active" className="navigation__link" exact>
          Settings
        </NavLink>
      </li>
      <li className="navigation__entry">
        <NavLink to="/dump" activeClassName="navigation__link--active" className="navigation__link" exact>
          Dump
        </NavLink>
      </li>
      { props.importQueueSize > 0 ? (
        <li className="navigation__entry navigation__entry--queuesize">
          {props.importQueueSize}
        </li>
      ) : null }
    </ul>
  </nav>
);

Navigation.propTypes = {
  importQueueSize: PropTypes.number.isRequired,
};

Navigation.defaultProps = {
};

export default Navigation;
