import IconButton from '@mui/material/Button';
import { useTranslations } from 'next-intl';
import React from 'react';
import WrappedNextLink from '@/components/WrappedNextLink';
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
      component={props.disabled ? 'span' : WrappedNextLink}
      disabled={props.disabled}
      href={getUrl({ pageIndex: props.page })}
      title={t('toPage', { page: props.page + 1 })}
    >
      { props.children }
    </IconButton>
  );
}

export default PaginationButton;
