import React from 'react';
import SVG from '../SVG';
import './index.scss';

interface Props {
  deleteFrame: () => void,
  editFrame: () => void,
}

const FrameButtons = ({ deleteFrame, editFrame }: Props) => (
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

export default FrameButtons;
