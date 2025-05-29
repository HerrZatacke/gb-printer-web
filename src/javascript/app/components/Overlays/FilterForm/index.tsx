import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Lightbox from '../../Lightbox';
import FilterFormTag from './filterFormTag';
import { SpecialTags } from '../../../../consts/SpecialTags';
import { useFilterForm } from '../../../../hooks/useFilterForm';

function FilterForm() {

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
      header="Select Filters"
      contentWidth="auto"
      actionButtons={(
        <>
          <Button
            disabled={!activeTags.length}
            title="Clear Filters"
            color="secondary"
            variant="outlined"
            onClick={clearTags}
          >
            Clear
          </Button>
          <Button
            disabled={!activeTags.length}
            title="Clear Filters and apply"
            color="secondary"
            variant="contained"
            onClick={applyClearTags}
          >
            Clear and apply
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
            If set, all must be met
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
              title="Untagged"
              tagActive={activeTags.includes(SpecialTags.FILTER_UNTAGGED)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_UNTAGGED, active)}
            />
            <FilterFormTag
              title="❤️ Favourite"
              tagActive={activeTags.includes(SpecialTags.FILTER_FAVOURITE)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_FAVOURITE, active)}
            />
            <FilterFormTag
              title="New"
              tagActive={activeTags.includes(SpecialTags.FILTER_NEW)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_NEW, active)}
            />
            <FilterFormTag
              title="Monochrome"
              tagActive={activeTags.includes(SpecialTags.FILTER_MONOCHROME)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_MONOCHROME, active)}
            />
            <FilterFormTag
              title="RGB"
              tagActive={activeTags.includes(SpecialTags.FILTER_RGB)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_RGB, active)}
            />
            <FilterFormTag
              title="Recent Imports"
              tagActive={activeTags.includes(SpecialTags.FILTER_RECENT)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_RECENT, active)}
            />
            <FilterFormTag
              title="Image has comments"
              tagActive={activeTags.includes(SpecialTags.FILTER_COMMENTS)}
              toggleTag={(active) => updateActiveTags(SpecialTags.FILTER_COMMENTS, active)}
            />
            <FilterFormTag
              title="Image has username"
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
            If set, one must be met
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
