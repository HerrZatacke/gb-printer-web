import type { CSSProperties } from 'react';

declare module 'react' {
  interface CSSPropertiesVars extends CSSProperties {
    [key: `--${string}`]: string | number
  }
}
