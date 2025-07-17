'use client';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React from 'react';
import Frame from '@/components/Frame';
import GalleryGrid from '@/components/GalleryGrid';
import GalleryViewSelect from '@/components/GalleryViewSelect';
import { ExportTypes } from '@/consts/exportTypes';
import useFrames from '@/hooks/useFrames';

function Frames() {
  const t = useTranslations('Frames');

  const {
    frameGroups,
    selectedFrameGroup,
    setSelectedFrameGroup,
    palette,
    groupFrames,
    exportJson,
    setActiveFrameGroupName,
    activeFrameGroup,
    convertFormat,
    enableDebug,
  } = useFrames();

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <TextField
        label={t('editFramegroup')}
        size="small"
        select
        value={selectedFrameGroup}
        onChange={(ev) => {
          setSelectedFrameGroup(ev.target.value);
        }}
      >
        { frameGroups.map(({ id, name }) => (
          <MenuItem key={id} value={id}>{ name }</MenuItem>
        )) }
      </TextField>
      {activeFrameGroup && (
        <TextField
          label={t('renameFramegroup')}
          size="small"
          type="text"
          onChange={(ev) => setActiveFrameGroupName(ev.target.value)}
          value={activeFrameGroup.name || ''}
        />
      )}
      <Stack
        direction="column"
        gap={2}
      >
        <GalleryViewSelect />
        <GalleryGrid>
          {(
            groupFrames?.map((frame) => (
              <Frame
                frameId={frame.id}
                key={`frame-${frame.id}`}
                name={frame.name}
                palette={palette}
              />
            ))
          )}
        </GalleryGrid>
      </Stack>
      <ButtonGroup
        variant="contained"
        fullWidth
      >
        <Button
          onClick={() => exportJson(ExportTypes.FRAMES)}
        >
          {t('exportFrames')}
        </Button>
        <Button
          onClick={() => exportJson(ExportTypes.CURRENT_FRAMEGROUP)}
        >
          {t('exportCurrentFramegroup', { id: selectedFrameGroup })}
        </Button>
        {
          enableDebug ? (
            <Button
              onClick={convertFormat}
            >
              {t('convertFramesFormat')}
            </Button>
          ) : null
        }
      </ButtonGroup>
    </Stack>
  );
}

export default Frames;
