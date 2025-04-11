import React from 'react';
import Chip from '@mui/material/Chip';
import { ActiveTagUpdateMode } from './useFilterForm';

interface Props {
  title: string,
  tagActive: boolean,
  toggleTag: (mode: ActiveTagUpdateMode) => void,
}

function FilterFormTag({ tagActive, toggleTag, title }: Props) {
  return (
    <Chip
      label={title}
      title={`${tagActive ? 'Remove' : 'Select'} "${title}"-tag`}
      size="small"
      onClick={() => toggleTag(tagActive ? ActiveTagUpdateMode.REMOVE : ActiveTagUpdateMode.ADD)}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      color={tagActive ? 'tertiary' : 'default'}
    />
  );
}

export default FilterFormTag;
