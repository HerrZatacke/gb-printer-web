import Stack from '@mui/material/Stack';
import React, { type PropsWithChildren } from 'react';

export interface Props {
  hidden: boolean;
}

function FilterFormTabPanel({ children, hidden }: Props & PropsWithChildren) {
  if (hidden) { return null; }

  return (
    <Stack
      direction="column"
      gap={4}
      role="tabpanel"
      sx={{ pt: 4 }}
    >
      {children}
    </Stack>
  );
}

export default FilterFormTabPanel;
