import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import { SpecialTags } from '@/consts/SpecialTags';
import { useFilterForm } from '@/hooks/useFilterForm';
import FilterFormTag from './filterFormTag';

function FilterForm() {
  const t = useTranslations('FilterForm');

  const {
    visible,
    availableTags,
    activeTags,
    updateActiveTags,
    clearTags,
    applyClearTags,
    confirm,
    cancel,
  } = useFilterForm();

  if (!visible) {
    return null;
  }

  return (
    <Lightbox
      confirm={confirm}
      deny={cancel}
      header={t('dialogHeader')}
      contentWidth="auto"
      actionButtons={(
        <>
          <Button
            disabled={!activeTags.length}
            title={t('clearFiltersTitle')}
            color="secondary"
            variant="outlined"
            onClick={clearTags}
          >
            {t('clear')}
          </Button>
          <Button
            disabled={!activeTags.length}
            title={t('clearFiltersAndApplyTitle')}
            color="secondary"
            variant="contained"
            onClick={applyClearTags}
          >
            {t('clearAndApply')}
          </Button>
        </>
      )}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <Stack
          direction="column"
          gap={1}
        >
          <Typography
            component="span"
            variant="body2"
          >
            {t('allMustBeMet')}
          </Typography>
          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            alignItems="center"
            sx={{
              '.MuiChip-root': {
                my: '1px', // IconButton for reset function is 2px higher than chip.
              },
            }}
          >
            <FilterFormTag
              title={t('untagged')}
              tagActive={activeTags.includes(SpecialTags.FILTER_UNTAGGED)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_UNTAGGED, active)}
            />
            <FilterFormTag
              title={t('favourite')}
              tagActive={activeTags.includes(SpecialTags.FILTER_FAVOURITE)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_FAVOURITE, active)}
            />
            <FilterFormTag
              title={t('new')}
              tagActive={activeTags.includes(SpecialTags.FILTER_NEW)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_NEW, active)}
            />
            <FilterFormTag
              title={t('monochrome')}
              tagActive={activeTags.includes(SpecialTags.FILTER_MONOCHROME)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_MONOCHROME, active)}
            />
            <FilterFormTag
              title={t('rgb')}
              tagActive={activeTags.includes(SpecialTags.FILTER_RGB)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_RGB, active)}
            />
            <FilterFormTag
              title={t('recentImports')}
              tagActive={activeTags.includes(SpecialTags.FILTER_RECENT)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_RECENT, active)}
            />
            <FilterFormTag
              title={t('imageHasComments')}
              tagActive={activeTags.includes(SpecialTags.FILTER_COMMENTS)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_COMMENTS, active)}
            />
            <FilterFormTag
              title={t('imageHasUsername')}
              tagActive={activeTags.includes(SpecialTags.FILTER_USERNAME)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_USERNAME, active)}
            />
          </Stack>
        </Stack>

        <Stack
          direction="column"
          gap={1}
        >
          <Typography
            component="span"
            variant="body2"
          >
            {t('oneMustBeMet')}
          </Typography>
          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            alignItems="center"
            sx={{
              '.MuiChip-root': {
                my: '1px', // IconButton for reset function is 2px higher than chip.
              },
            }}
          >
            {availableTags.map((tag) => (
              <FilterFormTag
                key={tag}
                title={tag}
                tagActive={activeTags.includes(tag)}
                toggleTag={(active) => updateActiveTags(tag, active)}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Lightbox>
  );
}

export default FilterForm;
