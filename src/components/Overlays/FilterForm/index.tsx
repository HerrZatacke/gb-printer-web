import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import FilterFormFrame from '@/components/Overlays/FilterForm/FilterFormFrame';
import FilterFormPalette from '@/components/Overlays/FilterForm/FilterFormPalette';
import FilterFormTab from '@/components/Overlays/FilterForm/FilterFormTab';
import FilterFormTag from '@/components/Overlays/FilterForm/FilterFormTag';
import { SpecialTags } from '@/consts/SpecialTags';
import { useFilterForm } from '@/hooks/useFilterForm';
import useItemsStore from '@/stores/itemsStore';
import useSettingsStore from '@/stores/settingsStore';
import sortBy, { SortDirection } from '@/tools/sortby';

enum FilterTab {
  TAGS = 'tabTags',
  PALETTES = 'tabPalettes',
  FRAMES = 'tabFrames',
}

interface FilterTabUsage {
  tab: FilterTab,
  count: number,
}

const sortByCount = sortBy<FilterTabUsage>('count', SortDirection.ASC);

function FilterForm() {
  const t = useTranslations('FilterForm');
  const tt = useTranslations('FilterForm.filterTabs');
  const [tabValue, setTabValue] = useState<FilterTab | null>(null);

  const {
    // Tags
    availableTags,
    activeTags,
    updateActiveTags,
    // Palettes
    availablePalettes,
    activePalettes,
    updateActivePalettes,
    // Frames
    availableFrames,
    activeFrames,
    updateActiveFrames,
    // Misc
    visible,
    applyClearTags,
    clearTags,
    clearPalettes,
    clearFrames,
    confirm,
    cancel,
  } = useFilterForm();

  useEffect(() => {
    if (tabValue) { return; }

    const mostFilters = sortByCount([
      { tab: FilterTab.FRAMES, count: activeFrames.length },
      { tab: FilterTab.PALETTES, count: activePalettes.length },
      { tab: FilterTab.TAGS, count: activeTags.length },
    ]);

    setTabValue(mostFilters[2].tab);
  }, [activeFrames.length, activePalettes.length, activeTags.length, tabValue]);

  const { palettes } = useItemsStore();
  const { activePalette } = useSettingsStore();

  const framePalette = useMemo(() => (
    palettes.find(({ shortName }) => shortName === activePalette) || palettes[0]
  ), [activePalette, palettes]);

  const clearCurrentTabSelection = useCallback(() => {
    switch (tabValue) {
      case FilterTab.TAGS:
        clearTags();
        break;

      case FilterTab.PALETTES:
        clearPalettes();
        break;

      case FilterTab.FRAMES:
        clearFrames();
        break;
    }
  }, [clearFrames, clearPalettes, clearTags, tabValue]);

  if (!visible || !tabValue) {
    return null;
  }

  const hasFilters = Boolean(activeTags.length + activePalettes.length + activeFrames.length);

  return (
    <Lightbox
      confirm={confirm}
      deny={cancel}
      header={t('dialogHeader')}
      contentWidth="auto"
      contentHeight="75vh"
      actionButtons={(
        <>
          <Button
            disabled={!hasFilters}
            title={t('clearFiltersTitle')}
            color="secondary"
            variant="outlined"
            onClick={clearTags}
          >
            {t('clear')}
          </Button>
          <Button
            disabled={!hasFilters}
            title={t('clearFiltersAndApplyTitle')}
            color="secondary"
            variant="outlined"
            onClick={applyClearTags}
          >
            {t('clearAndApply')}
          </Button>
        </>
      )}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <Tabs
          value={tabValue}
          onChange={(_, newValue: FilterTab) => setTabValue(newValue)}
        >
          <Tab
            label={tt(FilterTab.TAGS, { count: activeTags.length })}
            value={FilterTab.TAGS}
          />
          <Tab
            label={tt(FilterTab.PALETTES, { count: activePalettes.length })}
            value={FilterTab.PALETTES}
          />
          <Tab
            label={tt(FilterTab.FRAMES, { count: activeFrames.length })}
            value={FilterTab.FRAMES}
          />
        </Tabs>
        <Box>
          <IconButton
            onClick={clearCurrentTabSelection}
            title={t('clearTab', { tab: tabValue })}
          >
            <DeleteSweepIcon/>
          </IconButton>
        </Box>
      </Stack>
      <FilterFormTab hidden={tabValue !== FilterTab.TAGS} >
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
      </FilterFormTab>

      <FilterFormTab hidden={tabValue !== FilterTab.PALETTES} >
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
              button: {
                padding: 0,
                cursor: 'pointer',
                width: '2.5rem',
                height: '2.5rem',
                border: 'none',
                borderRadius: '50%',
              },
            }}
          >
            {availablePalettes.map((palette) => (
              <FilterFormPalette
                key={palette.shortName}
                palette={palette}
                paletteActive={activePalettes.includes(palette.shortName)}
                togglePalette={(active) => updateActivePalettes(palette.shortName, active)}
              />
            ))}
          </Stack>
        </Stack>
      </FilterFormTab>

      <FilterFormTab hidden={tabValue !== FilterTab.FRAMES} >
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
            alignItems="stretch"
            justifyContent="center"
            sx={{
              '.MuiButton-root': {
                width: '180px',
              },
            }}
          >
            {availableFrames.map(({ frame, usage }) => (
              <FilterFormFrame
                key={frame.id}
                usage={usage}
                frame={frame}
                palette={framePalette.palette}
                frameActive={activeFrames.includes(frame.id)}
                toggleFrame={(active) => updateActiveFrames(frame.id, active)}
              />
            ))}
          </Stack>
        </Stack>
      </FilterFormTab>
    </Lightbox>
  );
}

export default FilterForm;
