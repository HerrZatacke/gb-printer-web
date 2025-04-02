import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { AutocompleteInputChangeReason, AutocompleteChangeReason } from '@mui/material';
import MuiCleanThemeProvider from '../MuiCleanThemeProvider';
import { useAvailableTags } from '../../../hooks/useAvailableTags';
import { TagUpdateMode } from '../../../tools/modifyTagChanges';

interface Props {
  updateTags: (mode: TagUpdateMode, value: string) => void,
  selectedTags: string[],
}

function InputNewTag({ updateTags, selectedTags }: Props) {
  const { availableTags } = useAvailableTags();
  const selectableTags = availableTags.filter((tag) => !selectedTags.includes(tag));
  const [userValue, setUserValue] = useState('');

  return (
    <MuiCleanThemeProvider>
      <Autocomplete
        options={selectableTags}
        fullWidth
        size="small"
        inputValue={userValue}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            label="Tags"
          />
        )}
        clearOnBlur
        clearOnEscape
        freeSolo
        onInputChange={(_, value: string | null, changeReason: AutocompleteInputChangeReason) => {
          // console.log('onInputChange', value, changeReason);
          switch (changeReason) {
            case 'input':
              setUserValue(value || '');
              break;
            case 'reset':
            case 'clear':
            case 'blur':
              setUserValue('');
              break;
            case 'selectOption':
            case 'removeOption':
            default:
          }
        }}
        onChange={(_, value: string | null, changeReason: AutocompleteChangeReason) => {
          const stringValue = value || '';
          // console.log('onChange', stringValue, changeReason);
          switch (changeReason) {
            case 'createOption':
            case 'selectOption':
              updateTags(TagUpdateMode.ADD, stringValue.trim());
              break;
            case 'removeOption':
            case 'clear':
            case 'blur':
            default:
          }
        }}
      />
    </MuiCleanThemeProvider>
  );
}

export default InputNewTag;
