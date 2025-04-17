import React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import useFrames from './useFrames';
import Frame from '../Frame';
import GalleryGrid from '../GalleryGrid';
import GalleryViewSelect from '../GalleryViewSelect';
import { ExportTypes } from '../../../consts/exportTypes';

function Frames() {

  const {
    frameGroups,
    selectedFrameGroup,
    setSelectedFrameGroup,
    palette,
    groupFrames,
    exportJson,
    setActiveFrameGroupName,
    activeFrameGroup,
    convertFormat,
    enableDebug,
  } = useFrames();

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <TextField
        label="Edit Framegroup"
        size="small"
        select
        value={selectedFrameGroup}
        onChange={(ev) => {
          setSelectedFrameGroup(ev.target.value);
        }}
      >
        { frameGroups.map(({ id, name }) => (
          <MenuItem key={id} value={id}>{ name }</MenuItem>
        )) }
      </TextField>
      {activeFrameGroup && (
        <TextField
          label="Rename Framegroup"
          size="small"
          type="text"
          onChange={(ev) => setActiveFrameGroupName(ev.target.value)}
          value={activeFrameGroup.name || ''}
        />
      )}
      <GalleryViewSelect />
      <GalleryGrid>
        {(
          groupFrames?.map((frame) => (
            <Frame
              frameId={frame.id}
              key={`frame-${frame.id}`}
              name={frame.name}
              palette={palette}
            />
          ))
        )}
      </GalleryGrid>
      <ButtonGroup
        variant="contained"
        fullWidth
      >
        <Button
          onClick={() => exportJson(ExportTypes.FRAMES)}
        >
          Export frames
        </Button>
        <Button
          onClick={() => exportJson(ExportTypes.CURRENT_FRAMEGROUP)}
        >
          {`Export current framegroup (${selectedFrameGroup})`}
        </Button>
        {
          enableDebug ? (
            <Button
              onClick={convertFormat}
            >
              Convert frames to new format
            </Button>
          ) : null
        }
      </ButtonGroup>
    </Stack>
  );
}

export default Frames;
