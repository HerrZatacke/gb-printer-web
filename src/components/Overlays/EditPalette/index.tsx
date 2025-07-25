import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React, { useCallback, type ChangeEvent, type FocusEvent } from 'react';
import ColorPicker from '@/components/ColorPicker';
import ImageRender from '@/components/ImageRender';
import Lightbox from '@/components/Lightbox';
import { useEditPalette } from '@/hooks/useEditPalette';

function EditPalette() {
  const t = useTranslations('EditPalette');

  const {
    canConfirm,
    canEditShortName,
    newName,
    newShortName,
    palette,
    previewImages,
    shortName,
    setNewName,
    setNewShortName,
    setPalette,
    save,
    cancelEditPalette,
  } = useEditPalette();

  const handleTitleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setNewName(ev.target.value);
  }, [setNewName]);

  const handleShortNameChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setNewShortName(ev.target.value);
  }, [setNewShortName]);

  const handleShortNameBlur = useCallback((ev: FocusEvent<HTMLInputElement>) => {
    setNewShortName(ev.target.value.toLowerCase());
  }, [setNewShortName]);

  const handleColorChange = useCallback((index: number, value: string) => {
    const np = [...palette];
    np[index] = value;
    setPalette(np);
  }, [palette, setPalette]);

  if (!shortName) {
    return null;
  }

  return (
    <Lightbox
      confirm={save}
      canConfirm={canConfirm}
      deny={cancelEditPalette}
      header={t('dialogHeader', { name: newName ? `"${newName}"` : '' })}
      closeOnOverlayClick={false}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <TextField
          label={t('editTitle')}
          size="small"
          type="text"
          placeholder={t('addTitle')}
          value={newName}
          onChange={handleTitleChange}
        />

        <TextField
          label={t('idShortName')}
          size="small"
          type="text"
          value={newShortName}
          disabled={!canEditShortName}
          onChange={handleShortNameChange}
          onBlur={handleShortNameBlur}
          required
        />

        <Stack
          direction="row"
          gap={2}
          component="ul"
          justifyContent="space-around"
        >
          {
            previewImages.map((image) => (
              <Box
                key={image.hash}
                component="li"
              >
                <ImageRender
                  hash={image.hash}
                  invertPalette={false}
                  invertFramePalette={false}
                  lockFrame={false}
                  palette={palette}
                  framePalette={palette}
                />
              </Box>
            ))
          }
        </Stack>

        {
          palette.map((color, index) => (
            <ColorPicker
              key={`color-${index}`}
              label={t('colorIndex', { index: index + 1 })}
              value={color}
              onChange={(value) => handleColorChange(index, value)}
            />
          ))
        }
      </Stack>
    </Lightbox>
  );
}

export default EditPalette;
