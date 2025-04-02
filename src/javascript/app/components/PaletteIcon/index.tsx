import React from 'react';
import './index.scss';

interface Props {
  palette: string[],
}

function PaletteIcon({
  palette,
}: Props) {
  return (
    <span className="palette-icon">
      <span className="palette-icon__color" style={{ backgroundColor: palette[0] }} />
      <span className="palette-icon__color" style={{ backgroundColor: palette[1] }} />
      <span className="palette-icon__color" style={{ backgroundColor: palette[2] }} />
      <span className="palette-icon__color" style={{ backgroundColor: palette[3] }} />
    </span>
  );
}

export default PaletteIcon;
