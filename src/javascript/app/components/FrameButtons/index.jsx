import React from 'react';
import PropTypes from 'prop-types';
import SVG from '../SVG';
import './index.scss';

const FrameButtons = ({ deleteFrame, editFrame }) => (
  <div
    className="frame-buttons"
    onClick={(ev) => {
      ev.stopPropagation();
    }}
    role="presentation"
  >
    <button
      type="button"
      className="frame-buttons__button"
      onClick={deleteFrame}
    >
      <SVG name="delete" />
    </button>
    <button
      type="button"
      className="frame-buttons__button"
      onClick={editFrame}
    >
      <SVG name="edit" />
    </button>
  </div>
);

FrameButtons.propTypes = {
  deleteFrame: PropTypes.func.isRequired,
  editFrame: PropTypes.func.isRequired,
};

export default FrameButtons;
