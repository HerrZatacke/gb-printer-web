import React from 'react';
import PropTypes from 'prop-types';
import SVG from '../SVG';
import { useTheme, Theme } from '../../../hooks/useTheme';
import './index.scss';

const ThemeToggle = ({ closeNavigation }) => {
  const { theme, setTheme } = useTheme();

  const title = theme === Theme.BRIGHT ? 'Switch to dark mode' : 'Switch to bright mode';

  return (
    <label
      className="theme-toggle navigation__link"
      title={title}
    >
      <SVG name={theme === Theme.BRIGHT ? 'sun' : 'moon'} />
      <span className="theme-toggle__title">
        {title}
      </span>
      <input
        type="checkbox"
        checked={theme === Theme.BRIGHT}
        onChange={({ target }) => {
          closeNavigation();
          setTheme(target.checked ? Theme.BRIGHT : Theme.DARK);
        }}
      />
    </label>
  );
};

ThemeToggle.propTypes = {
  closeNavigation: PropTypes.func.isRequired,
};

ThemeToggle.defaultProps = {};

export default ThemeToggle;
