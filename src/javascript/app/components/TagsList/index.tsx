import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import type { Theme } from '@mui/system';
import { specialTags, SpecialTags } from '../../../consts/SpecialTags';

interface Props {
  tags: string[],
  fromGroup?: boolean,
}


const sortTags = (a: string, b: string) => (
  a.toLowerCase().localeCompare(b.toLowerCase())
);


function TagsList({ tags, fromGroup }: Props) {

  let showTags: string[];
  let moreTags: string[] = [];

  if (fromGroup) {
    const groupOnly = tags.sort(sortTags).filter((groupTag) => (
      !specialTags.includes(groupTag)
    ));

    showTags = groupOnly.slice(0, 3);
    moreTags = groupOnly.slice(3, -1);
  } else {
    showTags = tags;
  }

  const color = fromGroup ? 'secondary' : 'tertiary';

  return (
    <Stack
      component="ul"
      direction="row"
      gap={0.66}
      flexWrap="wrap"
      sx={(theme: Theme) => ({
        '& .MuiChip-root': {
          fontSize: '0.75rem',
          height: theme.spacing(2.5),
          padding: 0,
        },
      })}
    >
      { showTags
        .sort(sortTags)
        .map((tag) => (
          <Chip
            key={tag}
            title={tag === SpecialTags.FILTER_FAVOURITE ? 'Favourite' : tag}
            label={tag === SpecialTags.FILTER_FAVOURITE ? '❤️' : tag}
            size="small"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            color={color}
          />
        ))}

      {
        moreTags.length > 0 && (
          <Chip
            variant="outlined"
            title={`+${moreTags.length} more tags:\n${moreTags.join('\n')}`}
            label={`+${moreTags.length} more`}
            size="small"
          />
        )
      }
    </Stack>
  );
}

export default TagsList;
