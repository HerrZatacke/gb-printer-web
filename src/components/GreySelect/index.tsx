import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { BlendMode, RGBNPalette } from 'gb-image-decoder';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import ColorSlider from '@/components/ColorSlider';
import { blendModeLabels } from '@/consts/blendModes';
import type { RGBNHashes } from '@/types/Image';

interface Props {
  values: RGBNPalette,
  onChange: (values: RGBNPalette, confirm: boolean) => void,
  useChannels: Record<keyof RGBNHashes, boolean>,
}

function GreySelect(props: Props) {
  const t = useTranslations('GreySelect');

  const [values, setValues] = useState<RGBNPalette>(props.values);

  const debounced = useDebouncedCallback((debouncedValues) => {
    props.onChange(debouncedValues, true);
  }, 150, { leading: true, trailing: true });

  const change = (color: keyof RGBNPalette, valueUpdate: readonly number[] | string) => {
    const nextValues = {
      ...values,
      [color]: valueUpdate,
    };
    setValues(nextValues);
    debounced.callback(nextValues);
  };

  const usedChannels = (['r', 'g', 'b', 'n'] as (keyof RGBNHashes)[])
    .reduce((acc: (keyof RGBNHashes)[], channelName: keyof RGBNHashes): (keyof RGBNHashes)[] => {
      if (props.useChannels[channelName]) {
        return [...acc, channelName];
      }

      return acc;
    }, []);

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
                  value={values.blend}
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
                values={values[color] as number[]}
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
