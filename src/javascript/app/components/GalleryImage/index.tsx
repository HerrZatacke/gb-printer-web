import React, { useMemo, useCallback, useState } from 'react';
import { useLongPress } from 'use-long-press';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { blend } from '@mui/system';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { Theme } from '@mui/system';
import GalleryImageContextMenu from '../GalleryImageContextMenu';
import ImageRender from '../ImageRender';
import Debug from '../Debug';
import TagsList from '../TagsList';
import { useGalleryImage } from './useGalleryImage';
import { useDateFormat } from '../../../hooks/useDateFormat';
import useSettingsStore from '../../stores/settingsStore';
import { ImageSelectionMode } from '../../stores/filtersStore';
import isTouchDevice from '../../../tools/isTouchDevice';
import type { RGBNHashes } from '../../../../types/Image';

dayjs.extend(customParseFormat);

interface Props {
  hash: string,
  page: number,
}

function GalleryImage({ page, hash }: Props) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const { enableDebug } = useSettingsStore();

  const {
    galleryImageData,
    updateImageSelection,
    editImage,
  } = useGalleryImage(hash);

  const { formatter } = useDateFormat();

  const bindLongPress = useLongPress(() => {
    if (isTouchDevice()) {
      updateImageSelection(
        galleryImageData?.selectionIndex !== -1 ? ImageSelectionMode.REMOVE : ImageSelectionMode.ADD,
        false,
        page,
      );
    }
  });

  const globalClickListener = useCallback(() => {
    window.removeEventListener('click', globalClickListener);
    setMenuAnchor(null);
  }, []);


  const debugText = useMemo<string>(() => ([
    hash,
    ...(galleryImageData?.hashes ? Object.keys(galleryImageData.hashes).map((channel) => (
      `${channel.toUpperCase()}: ${galleryImageData.hashes?.[channel as keyof RGBNHashes]}`
    )) : []),
  ]
    .filter(Boolean)
    .join('\n')
  ), [galleryImageData, hash]);

  const theme: Theme = useTheme();

  const rootStyle = useMemo(() => {
    const baseStyles = {
      '&:hover': {
        backgroundColor: blend(theme.palette.tertiary.main, theme.palette.background.paper, 0.33),
      },
      transition: 'background-color 0.15s ease-in-out',
    };

    if (galleryImageData?.selectionIndex === -1) {
      return baseStyles;
    }

    return {
      ...baseStyles,
      backgroundColor: blend(theme.palette.info.main, theme.palette.background.paper, 0.75),
    };
  }, [galleryImageData, theme]);

  if (!galleryImageData) {
    return null;
  }

  const {
    created,
    hashes,
    palette,
    invertPalette,
    invertFramePalette,
    framePalette,
    frame,
    lockFrame,
    title,
    tags,
    selectionIndex,
    rotation,
  } = galleryImageData;

  const handleCellClick = (ev: React.MouseEvent) => {
    if (ev.ctrlKey || ev.shiftKey) {
      ev.preventDefault();
      updateImageSelection(
        selectionIndex !== -1 ? ImageSelectionMode.REMOVE : ImageSelectionMode.ADD,
        ev.shiftKey,
        page,
      );
    } else if (isTouchDevice()) {
      if (!menuAnchor) {
        setMenuAnchor(ev.target as HTMLElement);
        window.requestAnimationFrame(() => {
          window.addEventListener('click', globalClickListener);
        });
      }
    } else {
      ev.preventDefault();
      editImage(tags);
    }
  };

  const titleAttribute = [
    title,
    formatter(created),
  ]
    .filter(Boolean)
    .join('\n');


  return (
    <Card
      component="li"
      sx={rootStyle}
    >
      <ButtonBase
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...bindLongPress()}
        onClick={handleCellClick}
        disableRipple
        sx={{
          display: 'block',
          width: '100%',
        }}
      >
        <CardHeader
          title={title}
          subheader={formatter(created)}
          action={(
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                setMenuAnchor(ev.target as HTMLElement);
              }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          slotProps={{
            title: {
              title: titleAttribute,
              variant: 'body1',
              sx: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            },
            subheader: {
              title: titleAttribute,
              variant: 'caption',
              sx: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            },
          }}
          sx={{
            gap: 1,
            backgroundColor: alpha(theme.palette.fgtext.main, 0.1),
            p: 1,
            '.MuiCardHeader-content': {
              minWidth: 0, // allow the ellipsis
            },
          }}
        />
        {/* <Badge */}
        {/*   badgeContent={selectionIndex + 1} */}
        {/*   color="info" */}
        {/*   anchorOrigin={{ vertical: 'top', horizontal: 'left' }} */}
        {/*   sx={{ */}
        {/*     '& > .MuiBadge-badge': { */}
        {/*       transform: 'scale(1.33)', */}
        {/*       top: theme.spacing(0.5), */}
        {/*       left: theme.spacing(0.5), */}
        {/*     }, */}
        {/*   }} */}
        {/* /> */}
        <CardMedia>
          <ImageRender
            lockFrame={lockFrame}
            invertPalette={invertPalette}
            palette={palette}
            framePalette={framePalette}
            invertFramePalette={invertFramePalette}
            frameId={frame}
            hash={hash}
            hashes={hashes}
            rotation={rotation}
          />
        </CardMedia>
        { (tags.length > 0 || (debugText && enableDebug)) && (
          <CardContent
            sx={{
              p: 1,
              flexGrow: 1,
              justifyContent: 'space-between',
              display: 'flex',
              flexDirection: 'column',
              padding: 1,

              '&:last-child': {
                padding: 1,
              },
            }}
          >
            <TagsList tags={tags} />
            <Debug text={debugText} />
          </CardContent>
        )}
      </ButtonBase>
      <GalleryImageContextMenu
        hash={hash}
        menuAnchor={menuAnchor}
        onClose={() => setMenuAnchor(null)}
      />
    </Card>
  );
}

export default GalleryImage;
