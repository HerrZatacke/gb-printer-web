import React, { useMemo, useState } from 'react';
import type { PropsWithChildren, PointerEventHandler } from 'react';
import type { Theme } from '@mui/system';
import { alpha } from '@mui/material';
import { blend } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface WrapperProps extends PropsWithChildren {
  sx?: object,
  component?: React.ElementType,
  to?: string,
  onClick?: (ev: React.MouseEvent) => void,
  disableRipple?: boolean,
  onPointerDown?: PointerEventHandler,
  onPointerMove?: PointerEventHandler,
  onPointerUp?: PointerEventHandler,
  onPointerLeave?: PointerEventHandler,
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
      '&:hover': {
        backgroundColor: blend(theme.palette.tertiary.main, theme.palette.background.paper, 0.33),
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
    <Card
      component="li"
      sx={rootStyle}
    >
      <CardActionArea
        // eslint-disable-next-line react/jsx-props-no-spreading
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
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...contextMenuProps}
      />
    </Card>
  );
}

export default GalleryGridItem;
