import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState, useRef } from 'react';

interface Props {
  label: string,
  value: string,
  onChange: (value: string) => void,
}

const isValidColor = (color: string): boolean => {
  const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
  return hexColorRegex.test(color);
};

function ColorPicker({ value, onChange, label }: Props) {

  const [localValue, setLocalValue] = useState(value);
  const [id] = useState(`id-${Math.random().toString(16).split('.')[1]}`);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Store a stable reference to the latest onChange
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (isValidColor(localValue)) {
        onChangeRef.current(localValue);
      }
    }, 125);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue]);

  return (
    <FormControl
      variant="outlined"
      fullWidth
      size="small"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      color="tertiary"
      sx={{
        '--palette-color': isValidColor(localValue) ? localValue : '#000000',
        '.MuiOutlinedInput-notchedOutline': {
          inset: 0,
        },
        '[type=color]': {
          height: '100%',
          width: '100%',
          opacity: '0',
          cursor: 'pointer',
        },
      }}
    >
      <InputLabel
        shrink
        htmlFor={id}
      >
        {label}
      </InputLabel>
      <Stack
        direction="row"
        gap={1}
        sx={{
          '& > *': {
            flexBasis: 'auto',
            flexShrink: 0,
            flexGrow: 1,
          },
          '& > *:first-of-type': {
            flexBasis: '40px',
            flexShrink: 0,
            flexGrow: 0,
            backgroundColor: 'var(--palette-color)',
          },
        }}
      >
        <Paper variant="outlined">
          <input
            type="color"
            value={localValue}
            onChange={(ev) => setLocalValue(ev.target.value)}
            tabIndex={-1}
          />
        </Paper>
        <OutlinedInput
          id={id}
          type="text"
          value={localValue}
          onChange={(ev) => setLocalValue(ev.target.value)}
          onBlur={(ev) => setLocalValue(ev.target.value.toLowerCase())}
        />
      </Stack>
    </FormControl>
  );
}

export default ColorPicker;
