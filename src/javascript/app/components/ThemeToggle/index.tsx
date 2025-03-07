import React from 'react';
import SVG from '../SVG';
import useSettingsStore from '../../stores/settingsStore';
import { ThemeName } from '../../../consts/theme';
import './index.scss';

interface Props {
  closeNavigation: () => void,
}

function ThemeToggle({ closeNavigation }: Props) {
  const { themeName, setThemeName } = useSettingsStore();

  const title = themeName === ThemeName.BRIGHT ? 'Switch to dark mode' : 'Switch to bright mode';

  return (
    <label
      className="theme-toggle navigation__link"
      title={title}
    >
      <SVG name={themeName === ThemeName.BRIGHT ? 'sun' : 'moon'} />
      <span className="theme-toggle__title">
        {title}
      </span>
      <input
        type="checkbox"
        checked={themeName === ThemeName.BRIGHT}
        onChange={({ target }) => {
          closeNavigation();
          setThemeName(target.checked ? ThemeName.BRIGHT : ThemeName.DARK);
        }}
      />
    </label>
  );
}

export default ThemeToggle;
