import React from 'react';
import PropTypes from 'prop-types';
import frames from '../../../tools/applyFrame/frames';

const FrameSelect = (props) => (
  <>
    <h3 className="edit-image__section-title">Select Frame</h3>
    <select
      className="frame-select"
      value={props.frame}
      onChange={(ev) => {
        props.updateFrame(ev.target.value);
      }}
    >
      <option value="">As imported / No frame</option>
      {
        frames.map(({ id, name }) => (
          <option key={id} value={id}>{ name }</option>
        ))
      }
    </select>
  </>
);

FrameSelect.propTypes = {
  frame: PropTypes.string.isRequired,
  updateFrame: PropTypes.func.isRequired,
};

FrameSelect.defaultProps = {};

export default FrameSelect;
