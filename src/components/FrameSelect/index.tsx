import FilterNoneIcon from '@mui/icons-material/FilterNone';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import useItemsStore from '@/stores/itemsStore';
import { getFramesForGroup } from '@/tools/getFramesForGroup';

interface FrameSelectOption {
  id: string,
  name: string,
  isGroup: boolean,
}

interface Props {
  frame: string,
  updateFrame: (frame: string) => void,
  updateFrameLock?: (lockFame: boolean) => void,
  lockFrame?: boolean,
  noFrameOption?: string,
  selectLabel?: string,
}

function FrameSelect({
  frame,
  updateFrame,
  noFrameOption,
  updateFrameLock,
  lockFrame,
  selectLabel,
}: Props) {
  const t = useTranslations('FrameSelect');
  const { frames, frameGroups } = useItemsStore();

  const groupedFrames = useMemo<FrameSelectOption[]>((): FrameSelectOption[] => {
    const groups = frameGroups.map((group): FrameSelectOption[] => {
      const groupFrames = getFramesForGroup(frames, group.id);
      if (groupFrames.length === 0) {
        return [];
      }

      return [
        {
          id: group.id,
          name: group.name,
          isGroup: true,
        },
        ...groupFrames.map(({ id, name }) => (
          { id, name, isGroup: false }
        )),
      ];
    });

    return groups.flat();
  }, [frameGroups, frames]);

  return (
    <Stack
      direction="column"
      gap={2}
    >
      <TextField
        label={selectLabel || t('frameLabel')}
        select
        size="small"
        value={frame}
        onChange={(ev) => {
          updateFrame(ev.target.value);
        }}
      >
        <MenuItem value="">
          {noFrameOption || t('noFrameOption')}
        </MenuItem>
        {
          groupedFrames.map(({ id, name, isGroup }) => (
            isGroup ? (
              <ListSubheader
                key={id}
              >
                <ListItemIcon>
                  <FilterNoneIcon />
                </ListItemIcon>
                <ListItemText>
                  {`${name} (${id})`}
                </ListItemText>
              </ListSubheader>
            ) : (
              <MenuItem
                key={id}
                value={id}
              >
                {name}
              </MenuItem>
            )
          ))
        }
      </TextField>
      {
        (typeof updateFrameLock === 'function') ? (
          <FormControlLabel
            label={t('separateColorSettings')}
            control={(
              <Switch
                checked={lockFrame}
                onChange={({ target }) => {
                  updateFrameLock(target.checked);
                }}
              />
            )}
          />
        ) : null
      }
    </Stack>
  );
}

export default FrameSelect;
