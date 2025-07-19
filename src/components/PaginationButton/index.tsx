import IconButton from '@mui/material/Button';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useGalleryTreeContext } from '@/contexts/galleryTree';

export interface Props {
  children: React.ReactNode,
  disabled: boolean,
  page: number,
}

function PaginationButton(props: Props) {
  const t = useTranslations('PaginationButton');
  const { getUrl } = useGalleryTreeContext();

  return (
    <IconButton
      component={props.disabled ? 'span' : NextLink}
      disabled={props.disabled}
      href={getUrl({ pageIndex: props.page })}
      title={t('toPage', { page: props.page + 1 })}
    >
      { props.children }
    </IconButton>
  );
}

export default PaginationButton;
