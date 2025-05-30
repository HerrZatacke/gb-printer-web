import React from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Lightbox from '../../Lightbox';
import useEditImageGroup, { NEW_GROUP } from '../../../../hooks/useEditImageGroup';
import Debug from '../../Debug';

function EditImageGroup() {
  const {
    editId,
    absoluteSlug,
    possibleParents,
    slug,
    title,
    canConfirm,
    canMove,
    slugIsInUse,
    slugWasChanged,
    parentSlug,
    selectionCount,
    setSlug,
    setTitle,
    setParentSlug,
    confirm,
    move,
    cancelEditImageGroup,
  } = useEditImageGroup();

  return (
    <Lightbox
      confirm={confirm}
      canConfirm={canConfirm}
      header={editId !== NEW_GROUP ? `Editing group ${title ? `"${title}"` : ''}` : `Create new group with ${selectionCount} images`}
      deny={cancelEditImageGroup}
      contentWidth="auto"
      actionButtons={possibleParents.length > 1 && editId === NEW_GROUP && (
        <Button
          disabled={!canMove}
          onClick={move}
          variant="contained"
          color="secondary"
        >
          { `Move ${selectionCount} selected images` }
        </Button>
      )}
    >
      <Stack
        direction="column"
        gap={4}
      >
        { editId && (
          <>
            <TextField
              label="Title"
              size="small"
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <TextField
              label="Pathsegment (identifier)"
              size="small"
              type="text"
              value={slug}
              onChange={(ev) => setSlug(ev.target.value)}
              helperText={
                slugIsInUse ?
                  `Path${slugWasChanged ? ' is already in use' : ''}: "${absoluteSlug}"` :
                  `Path: "${absoluteSlug}"`
              }
              error={!canConfirm}
            />
            { possibleParents.length > 1 && (
              <TextField
                label="Parent group"
                size="small"
                select
                onChange={(ev) => setParentSlug(ev.target.value)}
                value={parentSlug}
              >
                { possibleParents.map(({ value, name }) => (
                  <MenuItem key={value} value={value}>{ name }</MenuItem>
                )) }
              </TextField>
            ) }
            <Debug text={JSON.stringify({ slug, parentSlug, canConfirm, slugIsInUse }, null, 2)} />
          </>
        )}
      </Stack>
    </Lightbox>
  );
}

export default EditImageGroup;
