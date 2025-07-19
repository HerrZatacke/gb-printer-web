import Chip from '@mui/material/Chip';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ActiveTagUpdateMode } from '@/hooks/useFilterForm';

interface Props {
  title: string,
  tagActive: boolean,
  toggleTag: (mode: ActiveTagUpdateMode) => void,
}

function FilterFormTag({ tagActive, toggleTag, title }: Props) {
  const t = useTranslations('FilterFormTag');
  
  return (
    <Chip
      label={title}
      title={t(tagActive ? 'removeTag' : 'selectTag', { title })}
      size="small"
      onClick={() => toggleTag(tagActive ? ActiveTagUpdateMode.REMOVE : ActiveTagUpdateMode.ADD)}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      color={tagActive ? 'tertiary' : 'default'}
    />
  );
}

export default FilterFormTag;
