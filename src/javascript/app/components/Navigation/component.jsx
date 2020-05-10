import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

const Navigation = (/* props */) => (
  <nav className="navigation">
    <ul className="navigation__list">
      <li className="navigation__entry">
        <Link to="/" className="navigation__link">
          Home
        </Link>
      </li>
      <li className="navigation__entry">
        <Link to="/gallery" className="navigation__link">
          Gallery
        </Link>
      </li>
      <li className="navigation__entry">
        <Link to="/palettes" className="navigation__link">
          Palettes
        </Link>
      </li>
      <li className="navigation__entry">
        <Link to="/settings" className="navigation__link">
          Settings
        </Link>
      </li>
    </ul>
  </nav>
);

Navigation.propTypes = {
};

Navigation.defaultProps = {
};

export default Navigation;
