import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import classnames from 'classnames';
import SVG from '../SVG';
import ThemeToggle from '../ThemeToggle';
import './index.scss';
import useNavigation from './useNavigation';
import { useGalleryParams } from '../../../hooks/useGalleryParams';
import useInteractionsStore from '../../stores/interactionsStore';

function Navigation() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { lastGalleryLink } = useGalleryParams();
  const { pathname } = useLocation();

  const {
    disableSerials,
    syncBusy,
    useSync,
    useSerials,
    syncLastUpdate,
    autoDropboxSync,
    selectSync,
    setShowSerials,
  } = useNavigation();

  const {
    showTrashCount,
    trashCount,
  } = useInteractionsStore();

  const sum = trashCount.frames + trashCount.images;

  const className = ({ isActive }: { isActive: boolean }) => `navigation__link ${isActive ? 'navigation__link--active' : ''}`;

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
            to="/home"
            className={className}
            onClick={() => setMobileNavOpen(false)}
          >
            Home
          </NavLink>
        </li>
        <li className="navigation__entry">
          <NavLink
            to={pathname === lastGalleryLink ? '/gallery/page/1' : lastGalleryLink}
            className={className}
            onClick={() => setMobileNavOpen(false)}
          >
            Gallery
          </NavLink>
        </li>
        <li className="navigation__entry">
          <NavLink
            to="/import"
            className={className}
            onClick={() => setMobileNavOpen(false)}
          >
            Import
          </NavLink>
        </li>
        <li className="navigation__entry">
          <NavLink
            to="/palettes"
            className={className}
            onClick={() => setMobileNavOpen(false)}
          >
            Palettes
          </NavLink>
        </li>
        <li className="navigation__entry">
          <NavLink
            to="/frames"
            className={className}
            onClick={() => setMobileNavOpen(false)}
          >
            Frames
          </NavLink>
        </li>
        <li className="navigation__entry">
          <NavLink
            to="/settings"
            className={className}
            onClick={() => setMobileNavOpen(false)}
          >
            Settings
          </NavLink>
        </li>
        <li className="navigation__entry navigation__entry--buttons">
          <button
            type="button"
            title="Trash Bin"
            className="navigation__link navigation__link--icon"
            onClick={() => showTrashCount(true)}
          >
            <SVG name="delete" />
            { sum > 0 ? (
              <span className="navigation__link-bubble">
                { sum }
              </span>
            ) : null }
          </button>
        </li>
        { useSync ? (
          <li className="navigation__entry navigation__entry--buttons">
            <button
              type="button"
              title="Synchronize"
              className="navigation__link navigation__link--icon"
              onClick={selectSync}
              disabled={syncBusy}
            >
              <SVG name="sync" />
              { autoDropboxSync && (syncLastUpdate.local !== syncLastUpdate.dropbox) ? (
                <span
                  className="navigation__link-bubble"
                  title={(
                    (syncLastUpdate.local > syncLastUpdate.dropbox) ?
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
        { useSerials ? (
          <li className="navigation__entry navigation__entry--right">
            <button
              title="WebUSB Serial devices"
              type="button"
              className="connect-usb-serial navigation__link"
              disabled={disableSerials}
              onClick={() => {
                setMobileNavOpen(false);
                setShowSerials();
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
}

export default Navigation;
