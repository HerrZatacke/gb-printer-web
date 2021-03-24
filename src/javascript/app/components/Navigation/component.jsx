import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';
import ThemeToggle from '../ThemeToggle';

const Navigation = (props) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav
      className={
        classnames('navigation', {
          'navigation--mobile-open': mobileNavOpen,
        })
      }
    >
      <button
        className="navigation__burger-button"
        type="button"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <SVG name={mobileNavOpen ? 'close-nav' : 'burger'} />
      </button>
      <ul className="navigation__list">
        <li className="navigation__entry">
          <NavLink
            to="/"
            activeClassName="navigation__link--active"
            className="navigation__link"
            exact
            onClick={() => setMobileNavOpen(false)}
          >
            Home
          </NavLink>
        </li>
        <li className="navigation__entry">
          <NavLink
            to="/gallery"
            activeClassName="navigation__link--active"
            className="navigation__link"
            exact
            onClick={() => setMobileNavOpen(false)}
          >
            Gallery
          </NavLink>
        </li>
        <li className="navigation__entry">
          <NavLink
            to="/import"
            activeClassName="navigation__link--active"
            className="navigation__link"
            exact
            onClick={() => setMobileNavOpen(false)}
          >
            Import
          </NavLink>
        </li>
        <li className="navigation__entry">
          <NavLink
            to="/palettes"
            activeClassName="navigation__link--active"
            className="navigation__link"
            exact
            onClick={() => setMobileNavOpen(false)}
          >
            Palettes
          </NavLink>
        </li>
        <li className="navigation__entry">
          <NavLink
            to="/settings"
            activeClassName="navigation__link--active"
            className="navigation__link"
            exact
            onClick={() => setMobileNavOpen(false)}
          >
            Settings
          </NavLink>
        </li>
        { props.useSync ? (
          <li className="navigation__entry navigation__entry--buttons">
            <button
              type="button"
              title="Synchronize"
              className="navigation__link navigation__link--icon"
              onClick={props.selectSync}
              disabled={props.syncBusy}
            >
              <SVG name="sync" />
            </button>
          </li>
        ) : null}
        <li className="navigation__entry navigation__entry--right">
          <ThemeToggle
            closeNavigation={() => setMobileNavOpen(false)}
          />
        </li>
      </ul>
    </nav>
  );
};

Navigation.propTypes = {
  selectSync: PropTypes.func.isRequired,
  useSync: PropTypes.bool.isRequired,
  syncBusy: PropTypes.bool.isRequired,
};

Navigation.defaultProps = {};

export default Navigation;
