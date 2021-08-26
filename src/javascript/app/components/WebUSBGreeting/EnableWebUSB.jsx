import React from 'react';
import classnames from 'classnames';
import SVG from '../SVG';
import useContainer from './hooks/useContainer';

const EnableWebUSB = () => {
  const { useSerials, setUseSerials } = useContainer();

  return (
    <label
      className={
        classnames('inputgroup checkgroup', {
          'checkgroup--checked': useSerials,
        })
      }
    >
      <span
        className="inputgroup__label"
        title="Hide dates in gallery"
      >
        Enable WebUSB / Serial ports
        <span
          className="inputgroup__note inputgroup__note--warn"
        >
          This is currently an experimental feature
        </span>
      </span>
      <span
        className="checkgroup__checkbox-wrapper"
      >
        <input
          type="checkbox"
          className="checkgroup__input"
          checked={useSerials}
          onChange={({ target }) => {
            setUseSerials(target.checked);
          }}
        />
        <SVG name="checkmark" />
      </span>
    </label>
  );
};

export default EnableWebUSB;
