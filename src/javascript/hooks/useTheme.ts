import { useEffect, useState } from 'react';

export enum Theme {
  BRIGHT = 'theme-bright',
  DARK = 'theme-dark',
}

export interface UseTheme {
  theme: Theme,
  setTheme: (theme: Theme) => void,
}

export const useTheme = (): UseTheme => {
  const [theme, setTheme] = useState<Theme>(localStorage.getItem('gbp-web-theme') as Theme || [Theme.BRIGHT, Theme.DARK][0]);

  useEffect(() => {
    localStorage.setItem('gbp-web-theme', theme);
    const classList = document.querySelector('html')?.classList;
    if (!classList) {
      return;
    }

    [Theme.BRIGHT, Theme.DARK].forEach((oldTheme) => {
      if (oldTheme === theme) {
        classList.add(theme);
      } else {
        classList.remove(oldTheme);
      }
    });

  }, [theme]);

  return {
    theme,
    setTheme,
  };
};
