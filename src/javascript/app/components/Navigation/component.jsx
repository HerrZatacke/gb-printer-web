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
              { props.autoDropboxSync && (props.syncLastUpdate.local !== props.syncLastUpdate.dropbox) ? (
                <span
                  className="navigation__link-bubble"
                  title={(
                    (props.syncLastUpdate.local > props.syncLastUpdate.dropbox) ?
                      'There are local changes not synched to dropbox yet' :
                      'There are remote changes not synched yet'
                  )}
                >
                  !
                </span>
              ) : null }
            </button>
          </li>
        ) : null}
        <li className="navigation__entry navigation__entry--right">
          <ThemeToggle
            closeNavigation={() => setMobileNavOpen(false)}
          />
        </li>
        { props.useSerials ? (
          <li className="navigation__entry navigation__entry--right">
            <button
              title="WebUSB Serial devices"
              type="button"
              className="connect-usb-serial navigation__link"
              disabled={props.disableSerials}
              onClick={() => {
                setMobileNavOpen(false);
                props.setShowSerials();
              }}
            >
              <SVG name="usb" />
              <span className="connect-usb-serial__title">
                WebUSB Serial devices
              </span>
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

Navigation.propTypes = {
  selectSync: PropTypes.func.isRequired,
  useSync: PropTypes.bool.isRequired,
  syncBusy: PropTypes.bool.isRequired,
  useSerials: PropTypes.bool.isRequired,
  disableSerials: PropTypes.bool.isRequired,
  setShowSerials: PropTypes.func.isRequired,
  syncLastUpdate: PropTypes.shape({
    dropbox: PropTypes.number.isRequired,
    local: PropTypes.number.isRequired,
  }).isRequired,
  autoDropboxSync: PropTypes.bool.isRequired,
};

Navigation.defaultProps = {};

export default Navigation;
