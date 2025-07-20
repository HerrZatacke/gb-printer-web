import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import GalleryGridItem from '@/components/GalleryGridItem';
import PaletteContextMenu from '@/components/PaletteContextMenu';
import { usePalette } from '@/hooks/usePalette';
import { generateGradient, GradientType } from '@/tools/generateGradient';

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
  const t = useTranslations('Palette');

  const paletteStyles = useMemo(() => {
    const styles = {
      ...generateGradient(palette, GradientType.SMOOTH),
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
      ...generateGradient(palette, GradientType.HARD),
      display: 'block',
      width: '100%',
      height: theme.spacing(8),
    };

    return styles;
  }, [palette, theme]);

  if (palette?.length !== 4) {
    return <li className="palette palette--broken" />;
  }

  return (
    <GalleryGridItem
      selectionText=""
      title={name}
      subheader={t('usageCount', { count: usage || 0, shortName })}
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
