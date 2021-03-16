import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SVG from '../SVG';
import useTheme, { themes } from '../../../hooks/useTheme';

const ThemeToggle = ({ closeNavigation }) => {
  const [theme, setTheme] = useState(localStorage.getItem('gbp-web-theme') || themes[0]);

  useTheme(theme);

  const title = theme === themes[0] ? 'Switch to dark mode' : 'Switch to bright mode';

  return (
    <label
      className="theme-toggle navigation__link"
      title={title}
    >
      <SVG name={theme === themes[0] ? 'sun' : 'moon'} />
      <span className="theme-toggle__title">
        {title}
      </span>
      <input
        type="checkbox"
        checked={theme === themes[0]}
        onChange={({ target }) => {
          closeNavigation();
          setTheme(target.checked ? themes[0] : themes[1]);
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
