import React from 'react';
import Typography from '@mui/material/Typography';

interface Props {
  imageCount: number,
  selectedCount: number,
  filteredCount: number,
}

function GalleryNumbers(props: Props) {

  return (
    <Typography component="h2" variant="caption">
      {`${props.imageCount} images`}
      { props.filteredCount ? ` / ${props.filteredCount} filtered` : null}
      { props.selectedCount ? ` / ${props.selectedCount} selected` : null}
    </Typography>
  );
}

export default GalleryNumbers;
