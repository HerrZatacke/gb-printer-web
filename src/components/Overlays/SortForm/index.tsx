import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import Lightbox from '@/components/Lightbox';
import { useSortForm } from '@/hooks/useSortForm';
import { SortDirection } from '@/tools/sortby';

interface Sortable {
  title: string,
  key: string,
}

function SortForm() {
  const t = useTranslations('SortForm');

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

  const sortables: Sortable[] = [
    {
      title: t('titleOption'),
      key: 'title',
    },
    {
      title: t('dateOption'),
      key: 'created',
    },
    {
      title: t('paletteOption'),
      key: 'palette',
    },
  ];

  const currentSortBy = sortables.find(({ key }) => (key === sortBy)) || sortables[0];
  const currentOrderLabel = sortOrder === SortDirection.ASC ? t('ascending') : t('descending');

  return (
    <Lightbox
      header={t('dialogHeader', { sortBy: currentSortBy.title, order: currentOrderLabel })}
      confirm={() => formSetSortBy(`${sortBy}_${sortOrder}`)}
      deny={hideSortForm}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <TextField
          label={t('sortByLabel')}
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
          label={t('sortDirectionLabel')}
          size="small"
          select
          value={sortOrder}
          onChange={(ev) => setSortOrder(ev.target.value as SortDirection)}
        >
          <MenuItem value={SortDirection.ASC}>{t('ascending')}</MenuItem>
          <MenuItem value={SortDirection.DESC}>{t('descending')}</MenuItem>
        </TextField>
      </Stack>
    </Lightbox>
  );
}

export default SortForm;
