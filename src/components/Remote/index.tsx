'use client';

import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';
import { ParentType, useRemoteWindow } from '@/hooks/useRemoteWindow';

function Remote() {
  const t = useTranslations('Remote');
  const { parentType } = useRemoteWindow();

  const formats = {
    p: (chunks: ReactNode) => (<p>{chunks}</p>),
    em: (chunks: ReactNode) => (<span className="remote-info--em">{chunks}</span>),
  };

  switch (parentType) {
    case ParentType.IFRAME: {
      return (
        <div className="remote-info">
          {t.rich('iframe', formats)}
        </div>
      );
    }

    case ParentType.POPUP: {
      return (
        <div className="remote-info">
          {t.rich('popup', {
            ...formats,
            host: window.location.host,
          })}
        </div>
      );
    }

    case ParentType.NONE:
    default: {
      return (
        <div className="remote-info">
          {t.rich('noReference', formats)}
        </div>
      );
    }
  }
}

export default Remote;
