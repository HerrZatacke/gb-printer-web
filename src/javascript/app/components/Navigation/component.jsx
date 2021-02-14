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
        { props.useGit ? (
          <li className="navigation__entry navigation__entry--buttons">
            <button
              type="button"
              title={`Synchronize to GitHub\n${props.repoUrl}`}
              className="navigation__link navigation__link--icon"
              onClick={() => props.startSync('up')}
              disabled={props.gitBusy}
            >
              <SVG name="sync" className="svg--180" />
            </button>
            <button
              type="button"
              title={`Synchronize from GitHub\n${props.repoUrl}`}
              className="navigation__link navigation__link--icon"
              onClick={() => props.startSync('down')}
              disabled={props.gitBusy}
            >
              <SVG name="sync" />
            </button>
          </li>
        ) : null}
        <li className="navigation__entry navigation__entry--right">
          <ThemeToggle />
        </li>
      </ul>
      {props.importQueueSize > 0 ? (
        <div className="navigation__queuesize">
          {props.importQueueSize}
        </div>
      ) : null}
    </nav>
  );
};

Navigation.propTypes = {
  importQueueSize: PropTypes.number.isRequired,
  startSync: PropTypes.func.isRequired,
  useGit: PropTypes.bool.isRequired,
  gitBusy: PropTypes.bool.isRequired,
  repoUrl: PropTypes.string.isRequired,
};

Navigation.defaultProps = {
};

export default Navigation;
