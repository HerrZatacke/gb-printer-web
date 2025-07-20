import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React from 'react';
import type { FrameGroup } from '@/types/FrameGroup';

interface Props {
  frameIndex: number,
  frameName: string,
  idValid: boolean,
  groupIdValid: boolean,
  frameIndexValid: boolean,
  frameGroup: string,
  groups: FrameGroup[],
  fullId: string,
  frameGroupName?: string,
  extraFields?: React.ReactNode,
  setFrameGroupName?: (frameGroupName: string) => void,
  setFrameIndex: (frameIndex: number) => void,
  setFrameGroup: (frameGroup: string) => void,
  setFrameName: (frameName: string) => void,
}

function EditFrameForm({
  frameIndex,
  frameName,
  idValid,
  groupIdValid,
  frameIndexValid,
  frameGroup,
  groups,
  fullId,
  frameGroupName,
  extraFields,
  setFrameGroupName,
  setFrameIndex,
  setFrameGroup,
  setFrameName,
}: Props) {
  const t = useTranslations('EditFrameForm');
  const groupExists = Boolean(groups.find(({ id }) => (frameGroup === id)));

  return (
    <Stack
      direction="column"
      gap={4}
    >
      {extraFields}
      <TextField
        label={t('frameGroup')}
        select
        size="small"
        type="text"
        value={frameGroup}
        onChange={(ev) => {
          setFrameGroup(ev.target.value);
        }}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          select: {
            renderValue: (selected) => {
              if (!groupExists) {
                return selected === '' ? t('selectFrameGroup') : t('newFrameGroup');
              }

              return groups.find(({ id }) => (
                id === selected
              ))?.name || t('unknown');
            },
          },
        }}
      >
        <MenuItem value="">
          {groupExists ? t('selectFrameGroup') : t('newFrameGroup')}
        </MenuItem>
        {
          groups.map(({ id, name }) => (
            <MenuItem value={id} key={id}>{ name }</MenuItem>
          ))
        }
      </TextField>

      <TextField
        label={groupExists ? t('frameGroupId') : t('newFrameGroupId')}
        size="small"
        type="text"
        value={frameGroup}
        onChange={(ev) => {
          setFrameGroup(ev.target.value);
        }}
        helperText={groupIdValid ? undefined : t('groupIdHelperText')}
      />

      { setFrameGroupName ? (
        <TextField
          label={t('newFrameGroupName')}
          size="small"
          type="text"
          onChange={(ev) => {
            setFrameGroupName(ev.target.value);
          }}
          value={groupExists ? '' : frameGroupName}
          disabled={groupExists}
        />
      ) : null }


      <TextField
        label={t('frameIndex')}
        size="small"
        type="number"
        slotProps={{
          htmlInput: { min: 1, max: 99 },
        }}
        value={frameIndex}
        onChange={(ev) => {
          setFrameIndex(parseInt(ev.target.value, 10));
        }}
        helperText={frameIndexValid ? null : t('frameIndexHelperText')}
      />

      <TextField
        label={t('frameName')}
        size="small"
        type="text"
        value={frameName}
        onChange={(ev) => {
          setFrameName(ev.target.value);
        }}
      />

      {!idValid && (
        <Alert
          severity="warning"
          variant="filled"
        >
          {t('idInUse', { id: fullId })}
        </Alert>
      )}
    </Stack>
  );
}

export default EditFrameForm;
