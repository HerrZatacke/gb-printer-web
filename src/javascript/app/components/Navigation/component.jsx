import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavOpen: false,
    };
    this.closeMobileNav = this.closeMobileNav.bind(this);
  }

  closeMobileNav() {
    this.setState({
      mobileNavOpen: false,
    });
  }

  render() {
    return (
      <nav
        className={
          classnames('navigation', {
            'navigation--mobile-open': this.state.mobileNavOpen,
          })
        }
      >
        <button
          className="navigation__burger-button"
          type="button"
          onClick={() => {
            // eslint-disable-next-line react/no-access-state-in-setstate
            const mobileNavOpen = !this.state.mobileNavOpen;
            this.setState({
              mobileNavOpen,
            });
          }}
        >
          <SVG name={this.state.mobileNavOpen ? 'close-nav' : 'burger'} />
        </button>
        <ul className="navigation__list">
          <li className="navigation__entry">
            <NavLink
              to="/"
              activeClassName="navigation__link--active"
              className="navigation__link"
              exact
              onClick={this.closeMobileNav}
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
              onClick={this.closeMobileNav}
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
              onClick={this.closeMobileNav}
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
              onClick={this.closeMobileNav}
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
              onClick={this.closeMobileNav}
            >
              Settings
            </NavLink>
          </li>
          <li className="navigation__entry">
            <button
              type="button"
              className="navigation__link"
              onClick={this.props.startSync}
              disabled={this.props.gitStatus.busy || !this.props.useGit}
            >
              Synchronize
            </button>
            { this.props.gitStatus.busy ? (
              <div
                className="navigation__progress"
                role="progressbar"
                style={{
                  width: `${this.props.gitStatus.progress * 100}%`,
                }}
              />
            ) : null }
          </li>
        </ul>
        {this.props.importQueueSize > 0 ? (
          <div className="navigation__queuesize">
            {this.props.importQueueSize}
          </div>
        ) : null}
      </nav>
    );
  }
}

Navigation.propTypes = {
  importQueueSize: PropTypes.number.isRequired,
  startSync: PropTypes.func.isRequired,
  useGit: PropTypes.bool.isRequired,
  gitStatus: PropTypes.shape({
    busy: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
  }).isRequired,
};

Navigation.defaultProps = {
};

export default Navigation;
