import type { Components } from '@mui/material/styles';
import { textFieldSlotDefaults } from '../../consts/textFieldSlotDefaults';

export const textField = (): Components['MuiTextField'] => ({
  defaultProps: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    color: 'tertiary',
    slotProps: textFieldSlotDefaults,
  },
});
