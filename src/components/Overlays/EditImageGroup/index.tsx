import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React from 'react';
import Debug from '@/components/Debug';
import useEditImageGroup, { NEW_GROUP } from '@/hooks/useEditImageGroup';
import Lightbox from '../../Lightbox';

function EditImageGroup() {
  const t = useTranslations('EditImageGroup');
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
      header={editId !== NEW_GROUP ? 
        t('dialogHeader', { title: title ? `"${title}"` : '' }) : 
        t('createNewGroupDialogHeader', { count: selectionCount })}
      deny={cancelEditImageGroup}
      contentWidth="auto"
      actionButtons={possibleParents.length > 1 && editId === NEW_GROUP && (
        <Button
          disabled={!canMove}
          onClick={move}
          variant="contained"
          color="secondary"
        >
          {t('moveSelectedImages', { count: selectionCount })}
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
              label={t('title')}
              size="small"
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <TextField
              label={t('pathSegment')}
              size="small"
              type="text"
              value={slug}
              onChange={(ev) => setSlug(ev.target.value)}
              helperText={
                slugIsInUse ?
                  t(slugWasChanged ? 'pathInUse' : 'path', { path: absoluteSlug }) :
                  t('path', { path: absoluteSlug })
              }
              error={!canConfirm}
            />
            { possibleParents.length > 1 && (
              <TextField
                label={t('parentGroup')}
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
