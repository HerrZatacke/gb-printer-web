import React from 'react';
import type { RGBNPalette } from 'gb-image-decoder';
import GameBoyImage from '../GameBoyImage';
import FrameButtons from '../FrameButtons';
import useFrame from './useFrame';

import './index.scss';

interface Props {
  frameId: string,
  name: string,
  palette: string[] | RGBNPalette,
}

function Frame({ frameId, name, palette }: Props) {
  const {
    tiles,
    deleteFrame,
    editFrame,
    frameHash,
    enableDebug,
    imageStartLine,
    usage,
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
        { tiles.length ? (
          <GameBoyImage
            lockFrame={false}
            invertPalette={false}
            palette={palette}
            imageStartLine={imageStartLine}
            tiles={tiles}
          />
        ) : null }
      </div>
      <div className="frame__row">
        <code className="frame__id">
          {frameId}
        </code>
        <span className="frame__usage">
          {usage ? `Used ${usage} times` : 'Not used'}
        </span>
      </div>
      <span className="frame__name">
        {name}
      </span>
      { enableDebug ? (
        <span className="frame__hash-debug">{ frameHash }</span>
      ) : null }
      <FrameButtons
        deleteFrame={deleteFrame}
        editFrame={editFrame}
      />
    </li>
  );
}

export default Frame;
