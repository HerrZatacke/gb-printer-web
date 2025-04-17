import React, { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { alpha } from '@mui/material';
import { blend } from '@mui/system';
import type { Theme } from '@mui/system';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImageRender from '../ImageRender';
import TagsList from '../TagsList';
import GalleryGroupContextMenu from '../GalleryGroupContextMenu';
import { useGalleryGroup } from './useGalleryGroup';
import { useGalleryImage } from '../GalleryImage/useGalleryImage';

interface Props {
  hash: string,
}

function GalleryGroup({ hash }: Props) {
  const { group, path } = useGalleryGroup(hash);
  const { galleryImageData } = useGalleryImage(hash);

  const theme: Theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const rootStyle = useMemo(() => {
    // ToDo: get this info from current TreeView
    const hasSelectedChildren = false;

    const baseStyles = {
      '&:hover': {
        backgroundColor: blend(theme.palette.tertiary.main, theme.palette.background.paper, 0.33),
      },
      transition: 'background-color 0.15s ease-in-out',
    };

    if (!hasSelectedChildren) {
      return baseStyles;
    }

    return {
      ...baseStyles,
      backgroundColor: blend(theme.palette.info.main, theme.palette.background.paper, 0.75),
    };
  }, [theme]);

  if (!galleryImageData || !group) {
    return null;
  }

  const {
    hashes,
    palette,
    invertPalette,
    framePalette,
    frame,
    lockFrame,
    rotation,
  } = galleryImageData;

  const imageCount = `${group.images.length} items`;
  const titleAttribute = `${group.title}\n${imageCount}`;

  return (
    <Card
      component="li"
      sx={rootStyle}
    >
      <Box
        component={Link}
        to={`/gallery/${path}page/1`}
        sx={{
          textDecoration: 'none',
        }}
      >
        <CardHeader
          title={group.title}
          subheader={imageCount}
          action={(
            <IconButton
              onClick={(ev) => {
                ev.preventDefault();
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

        <CardMedia>
          <ImageRender
            lockFrame={lockFrame}
            invertPalette={invertPalette}
            framePalette={framePalette}
            palette={palette}
            frameId={frame}
            hash={hash}
            hashes={hashes}
            rotation={rotation}
          />
        </CardMedia>

        {group.tags.length > 0 && (
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
            <TagsList tags={group.tags} fromGroup />
          </CardContent>
        )}
      </Box>
      <GalleryGroupContextMenu
        groupId={group.id}
        menuAnchor={menuAnchor}
        onClose={() => setMenuAnchor(null)}
      />
    </Card>
  );
}

export default GalleryGroup;
