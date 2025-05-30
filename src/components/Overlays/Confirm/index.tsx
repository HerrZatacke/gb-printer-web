import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import MetaTable from '@/components/MetaTable';
import { DialoqQuestionType } from '@/consts/dialog';
import useDialog from '@/hooks/useDialog';
import type {
  DialogQuestionCheckbox,
  DialogQuestionInfo,
  DialogQuestionNumber,
  DialogQuestionSelect,
  DialogQuestionText,
  DialogQuestionImage,
  DialogQuestionMeta,
} from '@/types/Dialog';

function Confirm() {

  const { message, questions, values, setSelected, confirm, deny } = useDialog();

  return (
    <Lightbox
      confirm={confirm}
      deny={deny}
      header={message}
      headerOnly={!questions.length}
    >
      <Stack
        direction="column"
        gap={2}
      >
        {
          questions.map((question) => {
            switch (question.type) {
              case DialoqQuestionType.SELECT: {
                const { label, key, options, disabled = false } = question as DialogQuestionSelect;
                return (
                  <TextField
                    key={key}
                    select
                    disabled={disabled}
                    size="small"
                    value={values[key] as string || ''}
                    label={label}
                    onChange={(ev) => setSelected({ [key]: ev.target.value })}
                  >
                    {
                      options.map(({ value: val, name }) => (
                        <MenuItem
                          value={val}
                          key={val}
                        >
                          {name}
                        </MenuItem>
                      ))
                    }
                  </TextField>
                );
              }

              case DialoqQuestionType.TEXT: {
                const { label, key, disabled = false } = question as DialogQuestionText;
                return (
                  <TextField
                    key={key}
                    disabled={disabled}
                    size="small"
                    value={values[key] as string || ''}
                    label={label}
                    onChange={(ev) => setSelected({ [key]: ev.target.value })}
                  />
                );
              }

              case DialoqQuestionType.NUMBER: {
                const { label, key, min, max, disabled = false } = question as DialogQuestionNumber;
                return (
                  <TextField
                    key={key}
                    disabled={disabled}
                    size="small"
                    value={values[key] as string || ''}
                    type="number"
                    label={label}
                    slotProps={{
                      htmlInput: { min, max },
                    }}
                    onChange={(ev) => setSelected({ [key]: ev.target.value })}
                  />
                );
              }

              case DialoqQuestionType.CHECKBOX: {
                const { label, key, disabled = false } = question as DialogQuestionCheckbox;

                return (
                  <FormControlLabel
                    key={key}
                    disabled={disabled}
                    label={label}
                    control={(
                      <Switch
                        checked={values[key] as boolean}
                        onChange={({ target }) => {
                          setSelected({ [key]: target.checked });
                        }}
                      />
                    )}
                  />
                );
              }

              case DialoqQuestionType.INFO: {
                const { label, key, severity } = question as DialogQuestionInfo;
                return severity ? (
                  <Alert
                    severity={severity}
                    key={key}
                    variant="filled"
                  >
                    {label}
                  </Alert>
                ) : (
                  <Typography
                    key={key}
                  >
                    {label}
                  </Typography>
                );
              }

              case DialoqQuestionType.IMAGE: {
                const { label, key, src } = question as DialogQuestionImage;
                return (
                  <Box
                    component="img"
                    key={key}
                    src={src}
                    alt={label}
                    title={label}
                    sx={{ imageRendering: 'pixelated' }}
                  />
                );
              }

              case DialoqQuestionType.META: {
                const { key, meta } = question as DialogQuestionMeta;
                return (
                  <MetaTable
                    key={key}
                    hash={meta.hash}
                    meta={meta?.meta}
                    hashes={meta?.hashes}
                  />
                );
              }

              default:
                return null;
            }
          })
        }
      </Stack>
    </Lightbox>
  );
}

export default Confirm;
