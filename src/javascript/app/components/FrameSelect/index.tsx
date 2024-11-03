import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import SVG from '../SVG';
import './index.scss';
import type { State } from '../../store/State';

interface Props {
  frame: string,
  updateFrame: (frame: string) => void,
  updateFrameLock?: (lockFame: boolean) => void,
  lockFrame?: boolean,
  noFrameOption?: string,
  selectLabel?: string,
}

function FrameSelect({
  frame,
  updateFrame,
  noFrameOption,
  updateFrameLock,
  lockFrame,
  selectLabel,
}: Props) {
  const frames = useSelector((state: State) => (state.frames));

  return (
    <div className="frame-select">
      {(
        selectLabel ? (
          <label
            className="frame-select__select-label"
            htmlFor="frame-select-select"
          >
            { selectLabel }
          </label>
        ) : null
      )}
      <select
        className="frame-select__select"
        id="frame-select-select"
        value={frame}
        onChange={(ev) => {
          updateFrame(ev.target.value);
        }}
      >
        <option value="">{noFrameOption || 'As imported / No frame'}</option>
        {
          frames.map(({ id, name }) => (
            <option key={id} value={id}>
              {`${name} (${id})`}
            </option>
          ))
        }
      </select>
      {
        (typeof updateFrameLock === 'function') ? (
          <label
            className={
              classnames('frame-select__check-label', {
                'frame-select__check-label--checked': lockFrame,
              })
            }
          >
            <input
              type="checkbox"
              className="frame-select__checkbox"
              checked={lockFrame}
              onChange={({ target }) => {
                updateFrameLock(target.checked);
              }}
            />
            <SVG name="checkmark" />
            <span className="frame-select__check-label-text">
              Use separate color settings for frame
            </span>
          </label>
        ) : null
      }
    </div>
  );
}

export default FrameSelect;
