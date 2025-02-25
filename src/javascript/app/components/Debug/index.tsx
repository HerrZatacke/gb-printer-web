import React from 'react';
import useSettingsStore from '../../stores/settingsStore';
import './index.scss';

interface Props {
  children: React.ReactNode,
}


function Debug({ children }: Props) {
  const { enableDebug } = useSettingsStore();

  if (!enableDebug) {
    return null;
  }

  return (
    <pre className="debug">
      { children }
    </pre>
  );
}

export default Debug;
