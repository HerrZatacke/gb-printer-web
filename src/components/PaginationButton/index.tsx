import IconButton from '@mui/material/Button';
import NextLink from 'next/link';
import React from 'react';
import { useGalleryParams } from '@/hooks/useGalleryParams';

export interface Props {
  children: React.ReactNode,
  disabled: boolean,
  page: number,
}

function PaginationButton(props: Props) {
  const { getUrl } = useGalleryParams();

  return (
    <IconButton
      component={props.disabled ? 'span' : NextLink}
      disabled={props.disabled}
      href={getUrl({ pageIndex: props.page })}
      title={`To page ${props.page + 1}`}
    >
      { props.children }
    </IconButton>
  );
}

export default PaginationButton;
