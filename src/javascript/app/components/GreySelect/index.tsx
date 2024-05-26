import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { BlendMode, RGBNPalette } from 'gb-image-decoder';
import { blendModeLabels } from '../../../consts/blendModes';
import ColorSlider from '../ColorSlider';
import { RGBNHashes } from '../../../../types/Image';

import './index.scss';

interface Props {
  values: RGBNPalette,
  onChange: (values: RGBNPalette, confirm: boolean) => void,
  useChannels: Record<keyof RGBNHashes, boolean>,
}

const GreySelect = (props: Props) => {

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
    <div className="grey-select">
      {
        usedChannels
          .map((color) => (
            [
              color === 'n' ? (
                <select
                  key="blendmode"
                  className="grey-select__select"
                  value={values.blend}
                  onChange={(ev) => {
                    change('blend', ev.target.value as BlendMode);
                  }}
                >
                  {
                    blendModeLabels.map(({ id, label }) => (
                      <option
                        key={id}
                        value={id}
                      >
                        {label}
                      </option>
                    ))
                  }
                </select>
              ) : null,
              (
                <ColorSlider
                  key={`slider-${color}`}
                  color={color as keyof RGBNHashes}
                  values={values[color] as number[]}
                  onChange={(valueChange) => {
                    change(color, valueChange);
                  }}
                />
              ),
            ]
          ).flat().filter(Boolean))
      }
    </div>
  );
};

export default GreySelect;
