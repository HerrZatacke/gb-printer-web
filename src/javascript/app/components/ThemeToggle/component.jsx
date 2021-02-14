import React, { useState, useEffect } from 'react';

const themes = ['theme-bright', 'theme-dark'];

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('gbp-web-theme') || themes[0]);

  useEffect(() => {
    localStorage.setItem('gbp-web-theme', theme);
    const classList = document.querySelector('html').classList;
    themes.forEach(classList.remove.bind(classList));
    classList.add(theme);
  }, [theme]);

  return (
    <input
      type="checkbox"
      className="theme-toggle"
      checked={theme === themes[0]}
      onChange={({ target }) => {
        setTheme(target.checked ? themes[0] : themes[1]);
      }}
    />
  );
};

ThemeToggle.propTypes = {};

ThemeToggle.defaultProps = {};

export default ThemeToggle;
