import LinearProgress from '@mui/material/LinearProgress';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import { useProgressBox } from '@/hooks/useProgressBox';

function ProgressBox() {
  const { message, progress } = useProgressBox();

  return (
    progress > 0 && (
      <Lightbox
        header={message}
      >
        <LinearProgress
          variant="determinate"
          value={progress * 100}
          color="secondary"
        />
      </Lightbox>
    )
  );
}

export default ProgressBox;
