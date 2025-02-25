import React from 'react';
import type { RGBNPalette } from 'gb-image-decoder';
import GameBoyImage from '../GameBoyImage';
import FrameButtons from '../FrameButtons';
import useFrame from './useFrame';

import './index.scss';
import Debug from '../Debug';

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
      <Debug>{ frameHash }</Debug>
      <FrameButtons
        deleteFrame={deleteFrame}
        editFrame={editFrame}
      />
    </li>
  );
}

export default Frame;
