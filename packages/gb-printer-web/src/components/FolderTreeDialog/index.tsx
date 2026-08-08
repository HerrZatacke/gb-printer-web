import { alpha } from '@mui/material';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { type Theme } from '@mui/system';
import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';
import { type TreeImageGroup } from 'gb-printer-schemas';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import Lightbox from '@/components/Lightbox';
import WrappedNextLink from '@/components/WrappedNextLink';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useImageGroups } from '@/hooks/useImageGroups';
import { usePathSegments } from '@/hooks/usePathSegments';
import unique from '@/tools/unique';

interface FolderTreeItemProps {
  group: TreeImageGroup;
  onClick: () => void;
}

function FolderTreeItem({ group, onClick }: FolderTreeItemProps) {
  const { getUrl } = useGalleryTreeContext();

  return (
    <TreeItem
      itemId={group.id}
      label={(
        <Link
          component={WrappedNextLink}
          href={getUrl({ group: group.fullSlug })}
          prefetch={false}
          onClick={onClick}
          sx={{ display: 'block' }}
        >
          {group.title}
        </Link>
      )}
      sx={(theme: Theme) => ({
        '& > .MuiTreeItem-content.Mui-selected': {
          backgroundColor: alpha(theme.palette.secondary.main, 0.8),
          color: theme.palette.secondary.contrastText,
          '&:hover,&.Mui-focused': {
            backgroundColor: theme.palette.secondary.main,
          },
        },
      })}
    >
      {
        group.groups.map((childGroup) => (
          <FolderTreeItem
            key={childGroup.id}
            group={childGroup}
            onClick={onClick}
          />
        ))
      }
    </TreeItem>
  );
}

interface FolderTreeDialogProps {
  open: boolean;
  onClose: () => void;
}

function FolderTreeDialog({ open, onClose }: FolderTreeDialogProps) {
  const t = useTranslations('FolderTreeDialog');
  const { pathsOptions, view } = useGalleryTreeContext();
  const theme = useTheme();
  const { imageGroupTree } = useImageGroups({ tree: true });
  const { segments } = usePathSegments();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setExpandedItems((currentItems: string[]) => {
        const fromNavi = segments.map(({ group }) => (group.id));
        return unique([...fromNavi, ...currentItems]);
      });
    }, 1);

    return () => window.clearTimeout(handle);
  }, [segments]);

  if (!imageGroupTree || pathsOptions.length < 2) {
    return null;
  }

  return (
    <Lightbox
      contentHeight="60vh"
      contentWidth="auto"
      deny={onClose}
      open={open}
      header={t('dialogHeader')}
      keepMounted={false}
    >
      <SimpleTreeView
        expansionTrigger="iconContainer"
        expandedItems={expandedItems}
        onExpandedItemsChange={(_, items) => setExpandedItems(items)}
        selectedItems={view?.id}
        sx={{
          width: theme.breakpoints.values.sm,
          height: '60vh',
        }}
      >
        <FolderTreeItem group={imageGroupTree} onClick={onClose} />
      </SimpleTreeView>
    </Lightbox>
  );
}

export default FolderTreeDialog;
