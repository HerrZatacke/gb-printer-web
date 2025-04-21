import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Lightbox from '../../Lightbox';
import useTrashbin from '../../../../hooks/useTrashbin';

function Trashbin() {
  const {
    showTrashCount,
    purgeTrash,
    downloadImages,
    downloadFrames,
    trashCount,
  } = useTrashbin();

  const sum = trashCount.frames + trashCount.images;

  return (
    <Lightbox
      deny={() => {
        showTrashCount(false);
      }}
      header={`Trash (${sum} items)`}
      contentWidth="auto"
      actionButtons={(
        <>
          <Button
            variant="contained"
            color="secondary"
            title="Download deleted frames"
            disabled={trashCount.frames === 0}
            onClick={downloadFrames}
          >
            Download frames
          </Button>
          <Button
            variant="contained"
            color="secondary"
            title="Download deleted images"
            disabled={trashCount.images === 0}
            onClick={downloadImages}
          >
            Download images
          </Button>
          <Button
            variant="contained"
            color="error"
            title="Purge all"
            disabled={sum === 0}
            onClick={purgeTrash}
          >
            { `Purge all (${sum})` }
          </Button>
        </>
      )}
    >
      <Stack
        direction="column"
        gap={2}
      >
        <Typography variant="body2">
          { `Deleted frames: ${trashCount.frames}` }
        </Typography>
        <Typography variant="body2">
          { `Deleted images: ${trashCount.images}` }
        </Typography>
      </Stack>
    </Lightbox>
  );
}

export default Trashbin;
