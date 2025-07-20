import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface UseAsPasswordField {
  type: 'text' | 'password',
  setShowPassword: (show: boolean) => void,
  button: ReactNode,
}

export const useAsPasswordField = (): UseAsPasswordField => {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations('useAsPasswordField');

  const button = useMemo<ReactNode>(() => (
    <IconButton
      title={t(showPassword ? 'hidePassword' : 'showPassword')}
      aria-label={t(showPassword ? 'hidePassword' : 'showPassword')}
      color="primary"
      onClick={() => {
        setShowPassword(!showPassword);
      }}
    >
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  ), [t, showPassword]);

  const type = useMemo(() => (
    showPassword ? 'text' : 'password'
  ), [showPassword]);

  return {
    type,
    button,
    setShowPassword,
  };
};
