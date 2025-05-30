import MoreVertIcon from '@mui/icons-material/MoreVert';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { blend } from '@mui/system';
import type { Theme } from '@mui/system';
import type { PropsWithChildren } from 'react';
import React, { useMemo, useState } from 'react';

interface WrapperProps extends PropsWithChildren {
  sx?: object,
  component?: React.ElementType,
  href?: string,
  onClick?: (ev: React.MouseEvent) => void,
  disableRipple?: boolean,
}

interface ContextMenuProps {
  groupId?: string,
  hash?: string,
  deleteFrame?: () => void,
  editFrame?: () => void,
  isPredefined?: boolean,
  clonePalette?: () => void,
  deletePalette?: () => void,
  editPalette?: () => void,
  setActive?: () => void,
}

interface Props {
  selectionText: string,
  title: string,
  titleIcon?: React.ReactNode,
  subheader?: string | null,
  wrapperProps: WrapperProps,
  media: React.ReactNode,
  content?: React.ReactNode,
  contextMenuComponent: React.ElementType,
  contextMenuProps: ContextMenuProps,
}

function GalleryGridItem({
  selectionText,
  title,
  titleIcon,
  subheader,
  wrapperProps,
  media,
  content,
  contextMenuComponent: ContextMenuComponent,
  contextMenuProps,
}: Props) {
  const theme: Theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const rootStyle = useMemo(() => {
    const baseStyles = {
      '@media (any-hover: hover)': {
        '&:hover': {
          backgroundColor: blend(theme.palette.tertiary.main, theme.palette.background.paper, 0.33),
        },
      },
      transition: 'background-color 0.15s ease-in-out',
    };

    if (!selectionText) {
      return baseStyles;
    }

    return {
      ...baseStyles,
      backgroundColor: blend(theme.palette.info.main, theme.palette.background.paper, 0.75),
    };
  }, [selectionText, theme]);

  const titleAttribute = [title, subheader].filter(Boolean).join('\n');

  return (
    <Stack
      component="li"
      direction="column"
      justifyContent="stretch"
      sx={{
        position: 'relative',
        '& > *': {
          flexGrow: 1,
        },
      }}
    >
      {selectionText && (
        <Box
          sx={{
            position: 'absolute',
            display: 'block',
            width: '1.8em',
            height: '1.8em',
            top: '-0.53em',
            left: '-0.53em',
            zIndex: 15,
            fontSize: '0.85rem',
            lineHeight: '1.8em',
            textAlign: 'center',
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        >
          {selectionText}
        </Box>
      )}
      <Card sx={rootStyle}>
        <CardActionArea

          {...wrapperProps}
          component={wrapperProps.component || 'span'}
          tabIndex={wrapperProps.component ? undefined : -1}
        >
          <CardHeader
            title={titleIcon ? (
              <Stack
                direction="row"
                gap={0.5}
                alignItems="center"
              >
                {titleIcon}
                {title}
              </Stack>
            ) : title}
            subheader={subheader}
            action={(
              <IconButton
                onClick={(ev) => {
                  ev.preventDefault();
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
          <CardMedia>
            {media}
          </CardMedia>
          {content && (
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
              {content}
            </CardContent>
          )}
        </CardActionArea>
        <ContextMenuComponent
          menuAnchor={menuAnchor}
          onClose={() => setMenuAnchor(null)}

          {...contextMenuProps}
        />
      </Card>
    </Stack>
  );
}

export default GalleryGridItem;
