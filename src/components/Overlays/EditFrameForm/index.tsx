import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React, { Dispatch, SetStateAction } from 'react';
import { EditFrameData, useEditFrameForm } from '@/hooks/useEditFrameForm';
import { useFrameGroups } from '@/hooks/useFrameGroups';

interface Props {
  editFrameData: EditFrameData;
  onEditDataChange: Dispatch<SetStateAction<EditFrameData | null>>;
  onFormValidChange: Dispatch<SetStateAction<boolean>>;

  extraFields?: React.ReactNode;
  newFrameGroupName?: string;
  setNewFrameGroupName?: (frameGroupName: string) => void;
}

function EditFrameForm({
  editFrameData,
  onEditDataChange,
  onFormValidChange,
  extraFields,
  newFrameGroupName,
  setNewFrameGroupName,
}: Props) {
  const t = useTranslations('EditFrameForm');
  const { frameGroups } = useFrameGroups();

  const {
    frameIndex,
    setFrameIndex,
    frameGroup,
    setFrameGroup,
    frameName,
    setFrameName,

    fullId,

    validation: {
      idValid,
      groupIdValid,
      frameIndexValid,
      groupExists,
    },
  } = useEditFrameForm(
    editFrameData,
    onEditDataChange,
    onFormValidChange,
  );

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

              return frameGroups.find(({ id }) => (
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
          frameGroups.map(({ id, name }) => (
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

      { setNewFrameGroupName ? (
        <TextField
          label={t('newFrameGroupName')}
          size="small"
          type="text"
          onChange={(ev) => {
            setNewFrameGroupName(ev.target.value);
          }}
          value={groupExists ? '' : newFrameGroupName}
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
