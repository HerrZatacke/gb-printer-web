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
      role="tabpanel"
      sx={{
        gap: 4,
        pt: 4,
      }}
    >
      {children}
    </Stack>
  );
}

export default FilterFormTabPanel;
