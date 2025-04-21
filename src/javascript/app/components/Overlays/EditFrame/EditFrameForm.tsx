import React from 'react';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { FrameGroup } from '../../../../../types/FrameGroup';

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
  const groupExists = Boolean(groups.find(({ id }) => (frameGroup === id)));

  return (
    <Stack
      direction="column"
      gap={4}
    >
      {extraFields}
      <TextField
        label="Frame group"
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
                return selected === '' ? 'Select frame group' : 'New frame group';
              }

              return groups.find(({ id }) => (
                id === selected
              ))?.name || 'Unknown';
            },
          },
        }}
      >
        <MenuItem value="">
          {groupExists ? 'Select frame group' : 'New frame group'}
        </MenuItem>
        {
          groups.map(({ id, name }) => (
            <MenuItem value={id} key={id}>{ name }</MenuItem>
          ))
        }
      </TextField>

      <TextField
        label={groupExists ? 'Frame group id' : 'New frame group id'}
        size="small"
        type="text"
        value={frameGroup}
        onChange={(ev) => {
          setFrameGroup(ev.target.value);
        }}
        helperText={groupIdValid ? undefined : 'Must have at least two characters, only lowercase'}
      />

      { setFrameGroupName ? (
        <TextField
          label="New frame group name"
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
        label="Frame Index"
        size="small"
        type="number"
        slotProps={{
          htmlInput: { min: 1, max: 99 },
        }}
        value={frameIndex}
        onChange={(ev) => {
          setFrameIndex(parseInt(ev.target.value, 10));
        }}
        helperText={frameIndexValid ? null : 'Integer, must be greater than 0'}
      />

      <TextField
        label="Frame name"
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
          {`Specified frame index/identifier "${fullId}" is already in use, please try another one.`}
        </Alert>
      )}
    </Stack>
  );
}

export default EditFrameForm;

