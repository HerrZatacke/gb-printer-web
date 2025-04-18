import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { usePalette } from './usePalette';
import GalleryGridItem from '../GalleryGridItem';
import PaletteContextMenu from '../PaletteContextMenu';
import { hexToRgbString } from '../../../tools/hexToRgbString';

interface Props {
  shortName: string,
  name: string,
  isPredefined: boolean,
  palette: string[],
  usage: number,
}

function Palette({
  shortName,
  name,
  isPredefined,
  palette,
  usage,
}: Props) {
  const {
    isActive,
    setActive,
    deletePalette,
    editPalette,
    clonePalette,
  } = usePalette(shortName, name);

  const theme = useTheme();

  const paletteStyles = useMemo(() => {
    const styles = {
      '--gradient-1': `${hexToRgbString(palette[0])}`,
      '--gradient-2': `${hexToRgbString(palette[1])}`,
      '--gradient-3': `${hexToRgbString(palette[2])}`,
      '--gradient-4': `${hexToRgbString(palette[3])}`,
      '--gradient-opacity': '0.25',
      backgroundImage: 'linear-gradient(to right, rgba(var(--gradient-1), var(--gradient-opacity)) 0%, rgba(var(--gradient-2), var(--gradient-opacity)) 33.3%, rgba(var(--gradient-3), var(--gradient-opacity)) 66.6%, rgba(var(--gradient-4), var(--gradient-opacity)) 100%)',
      display: 'block',
      width: '100%',
      textAlign: 'left',
      '.MuiTypography-body1': {
        fontWeight: isActive ? 'bold' : 'normal',
      },
    };

    return styles;
  }, [palette, isActive]);

  const mediaStyles = useMemo(() => {
    const styles = {
      backgroundImage: 'linear-gradient(to right, rgb(var(--gradient-1)) 0%, rgb(var(--gradient-1)) 25%, rgb(var(--gradient-2)) 25%, rgb(var(--gradient-2)) 50%, rgb(var(--gradient-3)) 50%, rgb(var(--gradient-3)) 75%, rgb(var(--gradient-4)) 75%, rgb(var(--gradient-4)) 100%)',
      display: 'block',
      width: '100%',
      height: theme.spacing(8),
    };

    return styles;
  }, [theme]);

  if (palette?.length !== 4) {
    return <li className="palette palette--broken" />;
  }

  return (
    <GalleryGridItem
      selectionText=""
      title={name}
      subheader={`(${shortName}) ${usage ? `Used ${usage} times` : 'Not used'}`}
      titleIcon={isActive ? <CheckCircleIcon /> : undefined}
      wrapperProps={{
        sx: paletteStyles,
        onClick: editPalette,
        disableRipple: true,
      }}
      contextMenuComponent={PaletteContextMenu}
      contextMenuProps={{
        isPredefined,
        setActive,
        clonePalette,
        deletePalette,
        editPalette,
      }}
      media={<Box sx={mediaStyles} />}
      content={null}
    />
  );
}


export default Palette;
