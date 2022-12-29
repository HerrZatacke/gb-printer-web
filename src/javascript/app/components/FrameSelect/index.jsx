import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import SVG from '../SVG';
import './index.scss';

const FrameSelect = ({
  frame,
  updateFrame,
  noFrameOption,
  updateFrameLock,
  lockFrame,
  selectLabel,
}) => {
  const frames = useSelector((state) => (state.frames));

  return (
    <>
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
        className="frame-select"
        id="frame-select-select"
        value={frame}
        onChange={(ev) => {
          updateFrame(ev.target.value);
        }}
      >
        <option value="">{noFrameOption}</option>
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
              Palette does not affect frame
            </span>
          </label>
        ) : null
      }
    </>
  );
};

FrameSelect.propTypes = {
  frame: PropTypes.string.isRequired,
  updateFrame: PropTypes.func.isRequired,
  updateFrameLock: PropTypes.func,
  lockFrame: PropTypes.bool,
  noFrameOption: PropTypes.string,
  selectLabel: PropTypes.string,
};

FrameSelect.defaultProps = {
  noFrameOption: 'As imported / No frame',
  selectLabel: false,
  lockFrame: false,
  updateFrameLock: null,
};

export default FrameSelect;
