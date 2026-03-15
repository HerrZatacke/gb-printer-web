import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { type BlendMode, type RGBNPalette } from 'gb-image-decoder';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import ColorSlider from '@/components/ColorSlider';
import { blendModeLabels } from '@/consts/blendModes';
import { type RGBNHashes } from '@/types/Image';

interface Props {
  values: RGBNPalette,
  onChange: (values: RGBNPalette, confirm: boolean) => void,
  useChannels: Record<keyof RGBNHashes, boolean>,
}

function GreySelect({ values, onChange, useChannels }: Props) {
  const t = useTranslations('GreySelect');

  const [localValues, setLocalValues] = useState<RGBNPalette>(values);

  const debounced = useDebouncedCallback((debouncedValues) => {
    onChange(debouncedValues, true);
  }, 150, { leading: true, trailing: true });

  const change = useCallback((color: keyof RGBNPalette, valueUpdate: readonly number[] | string) => {
    const nextValues = {
      ...localValues,
      [color]: valueUpdate,
    };
    setLocalValues(nextValues);
    debounced(nextValues);
  }, [debounced, localValues]);

  const usedChannels = useMemo(() => (
    (['r', 'g', 'b', 'n'] as (keyof RGBNHashes)[])
      .reduce((acc: (keyof RGBNHashes)[], channelName: keyof RGBNHashes): (keyof RGBNHashes)[] => {
        if (useChannels[channelName]) {
          return [...acc, channelName];
        }

        return acc;
      }, [])
  ), [useChannels]);

  return (
    <Stack
      direction="column"
      gap={3}
    >
      {
        usedChannels
          .map((color) => (
            <Stack
              key={`slider-${color}`}
              direction="column"
              gap={0}
            >
              {color === 'n' ? (
                <TextField
                  value={localValues.blend}
                  label={t('neutralLayerBlendmode')}
                  select
                  size="small"
                  onChange={(ev) => {
                    change('blend', ev.target.value as BlendMode);
                  }}
                >
                  {
                    blendModeLabels.map(({ id, translationKey }) => (
                      <MenuItem
                        key={id}
                        value={id}
                      >
                        {t(translationKey)}
                      </MenuItem>
                    ))
                  }
                </TextField>
              ) : null}
              <ColorSlider
                color={color as keyof RGBNHashes}
                values={localValues[color] as number[]}
                onChange={(valueChange) => {
                  change(color, valueChange);
                }}
              />
            </Stack>
          ))
      }
    </Stack>
  );
}

export default GreySelect;
