import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import GameBoyImage from '../../GameBoyImage';
import type { State } from '../../../store/State';
import { posTiles } from './posTiles';

import './index.scss';

interface Props {
  tiles: string[],
  startLine: number,
  setStartLine: (startLine: number) => void,
}

function EditFrameStartLine({ tiles, startLine, setStartLine }: Props) {

  const palette = useSelector((state: State) => (
    state.palettes.find(({ shortName }) => shortName === state.activePalette)?.palette
  ));

  const previewTiles = useMemo<string[]>(() => {
    const pt: string[] = [];

    pt.push(...tiles.slice(0, startLine * 20));

    for (let line = 0; line < 14; line += 1) {
      const frameSpliceLeftIndex = (line + startLine) * 20;
      const frameSpliceRightIndex = frameSpliceLeftIndex + 18;
      const posTilesSpliceIndex = line * 16;

      pt.push(
        ...tiles.slice(frameSpliceLeftIndex, frameSpliceLeftIndex + 2),
        ...posTiles.slice(posTilesSpliceIndex, posTilesSpliceIndex + 16),
        ...tiles.slice(frameSpliceRightIndex, frameSpliceRightIndex + 2),
      );
    }

    pt.push(...tiles.slice((startLine + 14) * 20));

    return pt;
  }, [tiles, startLine]);

  return (
    <div className="edit-frame-start-line">
      <GameBoyImage tiles={previewTiles} palette={palette} />
      <div className="edit-frame-start-line__buttons">
        <button
          className="button edit-frame-start-line__button"
          type="button"
          onClick={() => setStartLine(startLine - 1)}
          disabled={startLine <= 0}
        >
          Move image up
        </button>
        <button
          className="button edit-frame-start-line__button"
          type="button"
          onClick={() => setStartLine(startLine + 1)}
          disabled={startLine >= (tiles.length / 20) - 14}
        >
          Move image down
        </button>
      </div>
    </div>
  );
}

export default EditFrameStartLine;
