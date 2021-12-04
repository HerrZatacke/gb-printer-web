import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage/component';
import './index.scss';
import useFrame from './useFrame';


const Frame = ({ frameId, name, palette }) => {
  const { deleteFrame, tiles } = useFrame({ frameId, name });

  if (!tiles) {
    return null;
  }

  return (
    <li className="frame">
      <div className="frame__image">
        <GameBoyImage
          lockFrame={false}
          invertPalette={false}
          palette={palette}
          tiles={tiles}
        />
      </div>

      <button
        type="button"
        onClick={() => {
          // eslint-disable-next-line no-alert
          if (window.confirm('really delete?')) {
            deleteFrame();
          }
        }}
      >
        DELETE!!
      </button>
    </li>
  );
};

Frame.propTypes = {
  frameId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  palette: PropTypes.array.isRequired,
};

export default Frame;
