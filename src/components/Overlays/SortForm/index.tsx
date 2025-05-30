import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react';
import Lightbox from '@/components/Lightbox';
import { useSortForm } from '@/hooks/useSortForm';
import { SortDirection } from '@/tools/sortby';

interface Sortable {
  title: string,
  key: string,
}

const sortables: Sortable[] = [
  {
    title: 'Title',
    key: 'title',
  },
  {
    title: 'Date',
    key: 'created',
  },
  {
    title: 'Palette',
    key: 'palette',
  },
];

function SortForm() {
  const {
    visible,
    sortBy: formSortBy,
    sortOrder: formSortOrder,
    setSortBy: formSetSortBy,
    hideSortForm,
  } = useSortForm();

  const [sortBy, setSortBy] = useState<string>(formSortBy);
  const [sortOrder, setSortOrder] = useState<SortDirection>(formSortOrder);

  useEffect(() => {
    setSortBy(formSortBy);
    setSortOrder(formSortOrder);
  }, [setSortBy, setSortOrder, visible, formSortBy, formSortOrder]);

  if (!visible) {
    return null;
  }

  const currentSortBy = sortables.find(({ key }) => (key === sortBy)) || sortables[0];
  const currentOrderLabel = sortOrder === SortDirection.ASC ? 'Ascending' : 'Descending';

  return (
    <Lightbox
      header={`Sort by: ${currentSortBy.title}/${currentOrderLabel}`}
      confirm={() => formSetSortBy(`${sortBy}_${sortOrder}`)}
      deny={hideSortForm}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <TextField
          label="Sort by"
          size="small"
          select
          value={sortBy}
          onChange={(ev) => setSortBy(ev.target.value)}
        >
          { sortables.map(({ key, title }) => (
            <MenuItem key={key} value={key}>{ title }</MenuItem>
          )) }
        </TextField>
        <TextField
          label="Sort direction"
          size="small"
          select
          value={sortOrder}
          onChange={(ev) => setSortOrder(ev.target.value as SortDirection)}
        >
          <MenuItem value={SortDirection.ASC}>Ascending</MenuItem>
          <MenuItem value={SortDirection.DESC}>Descending</MenuItem>
        </TextField>
      </Stack>
    </Lightbox>
  );
}

export default SortForm;
