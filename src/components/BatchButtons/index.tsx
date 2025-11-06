import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import ExtensionIcon from '@mui/icons-material/Extension';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import GifIcon from '@mui/icons-material/Gif';
import PaletteIcon from '@mui/icons-material/Palette';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useTranslations } from 'next-intl';
import React, { type ReactNode, useState } from 'react';
import PluginSelect from '@/components/PluginSelect';
import { BatchActionType } from '@/consts/batchActionTypes';
import useBatchButtons from '@/hooks/useBatchButtons';

const BATCH_ACTIONS: BatchActionType[] = [
  BatchActionType.DOWNLOAD,
  BatchActionType.DELETE,
  BatchActionType.EDIT,
  BatchActionType.ANIMATE,
];

const BATCH_ACTIONS_MONOCHROME: BatchActionType[] = [
  BatchActionType.RGB,
];

const batchActionTitle = (id: BatchActionType) => {
  switch (id) {
    case BatchActionType.DELETE:
      return 'batchActions.delete';
    case BatchActionType.ANIMATE:
      return 'batchActions.animate';
    case BatchActionType.DOWNLOAD:
      return 'batchActions.download';
    case BatchActionType.EDIT:
      return 'batchActions.edit';
    case BatchActionType.RGB:
      return 'batchActions.rgb';
    default:
      return '';
  }
};


const actionIcon = (action: BatchActionType): ReactNode => {
  switch (action) {
    case BatchActionType.DELETE:
      return <DeleteIcon />;
    case BatchActionType.ANIMATE:
      return <GifIcon />;
    case BatchActionType.DOWNLOAD:
      return <DownloadIcon />;
    case BatchActionType.EDIT:
      return <EditIcon />;
    case BatchActionType.RGB:
      return <PaletteIcon />;
    default:
      return null;
  }
};

interface Props {
  page: number,
}

function BatchButtons({ page }: Props) {
  const t = useTranslations('BatchButtons');

  const {
    hasPlugins,
    batchEnabled,
    monochromeBatchEnabled,
    activeFilters,
    selectedImageCount,
    hasSelected,
    batchTask,
    checkAll,
    unCheckAll,
    filter,
    showSortOptions,
  } = useBatchButtons(page);

  const [pluginAnchor, setPluginAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <ButtonGroup
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        color="tertiary"
        variant="contained"
        sx={{ '& .MuiButton-root': { width: 40, height: 40 } }}
        disableElevation
      >
        <IconButton
          onClick={showSortOptions}
          title={t('manageSorting')}
        >
          <SwapVertIcon />
        </IconButton>
        <IconButton
          onClick={filter}
          title={t('manageFilters')}
        >
          <Badge
            badgeContent={activeFilters}
            color="info"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <FilterAltIcon />
          </Badge>
        </IconButton>
        <IconButton
          onClick={hasSelected ? unCheckAll : checkAll}
          title={hasSelected ? t('uncheckAll') : t('checkAll')}
        >
          <Badge
            badgeContent={selectedImageCount}
            color="info"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <CheckBoxIcon />
          </Badge>
        </IconButton>
        {
          BATCH_ACTIONS.map((action) => (
            <IconButton
              key={action}
              disabled={!batchEnabled}
              onClick={() => batchTask(action)}
              title={t(batchActionTitle(action))}
            >
              { actionIcon(action) }
            </IconButton>
          ))
        }
        {
          BATCH_ACTIONS_MONOCHROME.map((action) => (
            <IconButton
              key={action}
              disabled={!monochromeBatchEnabled}
              onClick={() => batchTask(action)}
              title={t(batchActionTitle(action))}
            >
              { actionIcon(action) }
            </IconButton>
          ))
        }
        {hasPlugins ? (
          <IconButton
            disabled={!batchEnabled}
            onClick={(ev) => {
              setPluginAnchor(ev.target as HTMLElement);
            }}
            title={t('usePlugin')}
          >
            <ExtensionIcon />
          </IconButton>
        ) : null}
      </ButtonGroup>
      <PluginSelect
        pluginAnchor={pluginAnchor}
        onClose={() => setPluginAnchor(null)}
      />
    </>
  );
}

export default BatchButtons;
