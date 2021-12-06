import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage/component';
import FrameButtons from '../FrameButtons';
import './index.scss';
import useFrame from './useFrame';


const Frame = ({ frameId, name, palette }) => {
  const {
    tiles,
    deleteFrame,
    editFrame,
  } = useFrame({ frameId, name });

  if (!tiles) {
    return null;
  }

  return (
    <li
      className="frame"
      onClick={editFrame}
      role="presentation"
    >
      <div className="frame__image">
        <GameBoyImage
          lockFrame={false}
          invertPalette={false}
          palette={palette}
          tiles={tiles}
        />
      </div>
      <code className="frame__id">
        {frameId}
      </code>
      <span className="frame__name">
        {name}
      </span>
      <FrameButtons
        deleteFrame={deleteFrame}
        editFrame={editFrame}
      />
    </li>
  );
};

Frame.propTypes = {
  frameId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  palette: PropTypes.array.isRequired,
};

export default Frame;
