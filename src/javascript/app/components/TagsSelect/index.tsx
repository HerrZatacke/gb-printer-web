import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Stack from '@mui/material/Stack';
import InputNewTag from './InputNewTag';
import unique from '../../../tools/unique';
import { SpecialTags } from '../../../consts/SpecialTags';
import type { TagChange } from '../../../tools/applyTagChanges';
import { TagUpdateMode } from '../../../tools/modifyTagChanges';

interface Props {
  tags: TagChange
  updateTags: (mode: TagUpdateMode, tag: string) => void,
  resetTags: () => void,
}

function TagsSelect({
  tags,
  updateTags,
  resetTags,
}: Props) {
  const activeTags = unique([...tags.initial, ...tags.add]);

  return (
    <Stack
      direction="column"
      gap={2}
    >
      <InputNewTag
        updateTags={updateTags}
        selectedTags={activeTags}
      />
      { activeTags.length > 0 && (
        <Stack
          direction="row"
          gap={1}
          flexWrap="wrap"
          alignItems="center"
          component="ul"
          sx={{
            '.MuiChip-root': {
              my: '1px', // IconButton for reset function is 2px higher than chip.
            },
          }}
        >
          {
            activeTags.map((tag) => {
              const isAdded = tags.add.includes(tag);
              const isRemoved = tags.remove.includes(tag);
              let color: 'default' | 'success' | 'error';

              if (isAdded) {
                color = 'success';
              } else if (isRemoved) {
                color = 'error';
              } else {
                color = 'default';
              }

              return (
                <Chip
                  key={tag}
                  label={(
                    <Stack
                      direction="row"
                      gap={1}
                      alignItems="center"
                    >
                      {tag === SpecialTags.FILTER_FAVOURITE ? '❤️' : tag}
                      <Stack
                        direction="row"
                        gap={0}
                        sx={{
                          mr: -1,
                          '.MuiButtonBase-root': {
                            opacity: 0.4,
                            borderRadius: '50%',

                            '&:hover': {
                              opacity: 1,
                            },

                            '&:focus-visible': {
                              opacity: 1,
                              background: 'color-mix(in srgb, currentColor 20%, transparent)',
                            },
                          },
                        }}
                      >
                        <ButtonBase
                          onClick={() => updateTags(TagUpdateMode.ADD, tag)}
                        >
                          <AddIcon />
                        </ButtonBase>
                        <ButtonBase
                          onClick={() => updateTags(TagUpdateMode.REMOVE, tag)}
                        >
                          <RemoveIcon />
                        </ButtonBase>
                      </Stack>
                    </Stack>
                  )}
                  color={color}
                  variant="filled"
                />
              );
            })
          }
          {(tags.add.length + tags.remove.length) > 0 && (
            <IconButton
              onClick={resetTags}
              title="Reset tags"
              size="small"
            >
              <RestartAltIcon />
            </IconButton>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default TagsSelect;
