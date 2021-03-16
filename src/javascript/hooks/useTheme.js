import { useEffect } from 'react';

const themes = ['theme-bright', 'theme-dark'];

const useTheme = (theme = localStorage.getItem('gbp-web-theme')) => {
  useEffect(() => {
    localStorage.setItem('gbp-web-theme', theme);
    const classList = document.querySelector('html').classList;
    themes.forEach(classList.remove.bind(classList));
    classList.add(theme);
  }, [theme]);
};

export {
  themes,
};

export default useTheme;
