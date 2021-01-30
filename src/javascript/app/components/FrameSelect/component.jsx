import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

const FrameSelect = (props) => (
  <>
    <select
      className="frame-select"
      value={props.frame}
      onChange={(ev) => {
        props.updateFrame(ev.target.value);
      }}
    >
      <option value="">{props.noFrameOption}</option>
      {
        props.frames.map(({ id, name }) => (
          <option key={id} value={id}>
            { `${name} (${id})` }
          </option>
        ))
      }
    </select>
    <label
      className={
        classnames('frame-select__check-label', {
          'frame-select__check-label--checked': props.lockFrame,
        })
      }
    >
      <input
        type="checkbox"
        className="frame-select__checkbox"
        checked={props.lockFrame}
        onChange={({ target }) => {
          props.updateFrameLock(target.checked);
        }}
      />
      <SVG name="checkmark" />
      <span className="frame-select__check-label-text">
        Palette does not affect frame
      </span>
    </label>
  </>
);

FrameSelect.propTypes = {
  frame: PropTypes.string.isRequired,
  frames: PropTypes.array.isRequired,
  updateFrame: PropTypes.func.isRequired,
  updateFrameLock: PropTypes.func.isRequired,
  lockFrame: PropTypes.bool.isRequired,
  noFrameOption: PropTypes.string,
};

FrameSelect.defaultProps = {
  noFrameOption: 'As imported / No frame',
};

export default FrameSelect;
