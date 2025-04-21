import React from 'react';
import IconButton from '@mui/material/Button';
import { Link as RouterLink } from 'react-router';
import { useGalleryParams } from '../../../hooks/useGalleryParams';

export interface Props {
  children: React.ReactNode,
  disabled: boolean,
  page: number,
}

function PaginationButton(props: Props) {
  const { path } = useGalleryParams();

  return (
    <IconButton
      component={props.disabled ? 'span' : RouterLink}
      disabled={props.disabled}
      to={`/gallery/${path}page/${props.page + 1}`}
      title={`To page ${props.page + 1}`}
    >
      { props.children }
    </IconButton>
  );
}

export default PaginationButton;
