import React, { CSSPropertiesVars } from 'react';

import classnames from 'classnames';
import SVG from '../SVG';
import { usePalette } from './usePalette';

import './index.scss';

const GRADIENT_OPACITY = '36';

interface Props {
  shortName: string,
  name: string,
  isPredefined: boolean,
  palette: string[],
  usage: number,
}

const Component = ({
  shortName,
  name,
  isPredefined,
  palette,
  usage,
}: Props) => {

  const {
    isActive,
    setActive,
    deletePalette,
    editPalette,
    clonePalette,
  } = usePalette(shortName, name);

  if (palette?.length !== 4) {
    return <li className="palette palette--broken" />;
  }

  return (
    <li
      className={
        classnames('palette', {
          'palette--active': isActive,
        })
      }
      style={{
        '--gradient-1': `${palette[0]}${GRADIENT_OPACITY}`,
        '--gradient-2': `${palette[1]}${GRADIENT_OPACITY}`,
        '--gradient-3': `${palette[2]}${GRADIENT_OPACITY}`,
        '--gradient-4': `${palette[3]}${GRADIENT_OPACITY}`,
      } as CSSPropertiesVars}
    >
      <button
        onClick={() => {
          setActive();
        }}
        className="palette__button"
        type="button"
      >
        <div className="palette__name">
          {name}
          <span className="palette__shortname">{shortName}</span>
          <span className="palette__usage">{usage ? `Used ${usage} times` : 'Not used'}</span>
        </div>
        <div className="palette__colors">
          <div className="palette__color" style={{ backgroundColor: palette[0] }} title={palette[0]}> </div>
          <div className="palette__color" style={{ backgroundColor: palette[1] }} title={palette[1]}> </div>
          <div className="palette__color" style={{ backgroundColor: palette[2] }} title={palette[2]}> </div>
          <div className="palette__color" style={{ backgroundColor: palette[3] }} title={palette[3]}> </div>
        </div>
      </button>
      <div className="palette__manage-buttons">
        <button
          type="button"
          title="Clone palette"
          className="palette__manage-button palette__manage-button--clone"
          onClick={() => clonePalette()}
        >
          <SVG name="clone" />
        </button>
        {
          isPredefined ? null : (
            <>
              <button
                type="button"
                title="Edit palette"
                className="palette__manage-button palette__manage-button--edit"
                onClick={() => editPalette()}
              >
                <SVG name="edit" />
              </button>
              <button
                type="button"
                title="Delete palette"
                className="palette__manage-button palette__manage-button--delete"
                onClick={() => deletePalette()}
              >
                <SVG name="delete" />
              </button>
            </>
          )
        }
      </div>
    </li>
  );
};


export default Component;
