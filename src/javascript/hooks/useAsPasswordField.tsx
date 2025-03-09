import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

interface UseAsPasswordField {
  type: 'text' | 'password',
  setShowPassword: (show: boolean) => void,
  button: ReactNode,
}

export const useAsPasswordField = (): UseAsPasswordField => {
  const [showPassword, setShowPassword] = useState(false);

  const button = useMemo<ReactNode>(() => (
    <IconButton
      title={showPassword ? 'Hide Password' : 'Show Password'}
      aria-label={showPassword ? 'hide the password' : 'display the password'}
      color="primary"
      onClick={() => {
        setShowPassword(!showPassword);
      }}
    >
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  ), [showPassword]);

  const type = useMemo(() => (
    showPassword ? 'text' : 'password'
  ), [showPassword]);

  return {
    type,
    button,
    setShowPassword,
  };
};
