import React, { useMemo } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GameBoyImage from '../../GameBoyImage';
import { posTiles } from './posTiles';
import useItemsStore from '../../../stores/itemsStore';
import useSettingsStore from '../../../stores/settingsStore';

interface Props {
  tiles: string[],
  startLine: number,
  setStartLine: (startLine: number) => void,
}

function EditFrameStartLine({ tiles, startLine, setStartLine }: Props) {
  const { activePalette } = useSettingsStore();
  const { palettes } = useItemsStore();

  const palette = palettes.find(({ shortName }) => shortName === activePalette)?.palette;

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
    <Stack
      direction="row"
      gap={3}
      justifyContent="center"
    >
      <GameBoyImage
        tiles={previewTiles}
        palette={palette}
        imageStartLine={startLine}
      />
      <Stack
        direction="column"
        justifyContent="center"
      >
        <ButtonGroup
          orientation="vertical"
          variant="contained"
          size="large"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          color="tertiary"
          fullWidth
        >
          <Button
            onClick={() => setStartLine(startLine - 1)}
            disabled={startLine <= 0}
            endIcon={<KeyboardArrowUpIcon />}
          >
            Move image up
          </Button>
          <Button
            onClick={() => setStartLine(startLine + 1)}
            disabled={startLine >= (tiles.length / 20) - 14}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Move image down
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}

export default EditFrameStartLine;
