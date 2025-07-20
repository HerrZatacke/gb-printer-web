import WarningIcon from '@mui/icons-material/Warning';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import React from 'react';
import { usePluginsContext } from '@/contexts/plugins';
import useFiltersStore from '@/stores/filtersStore';
import useItemsStore from '@/stores/itemsStore';

interface Props {
  pluginAnchor: HTMLElement | null,
  onClose: () => void,
  hash?: string,
}

function PluginSelect({ pluginAnchor, hash, onClose }: Props) {
  const t = useTranslations('PluginSelect');
  const { plugins } = useItemsStore();
  const { imageSelection } = useFiltersStore();
  const { runWithImage, runWithImages } = usePluginsContext();

  const dispatchToPlugin = (url: string) => {
    if (hash) {
      runWithImage(url, hash);
    } else {
      runWithImages(url, imageSelection);
    }
  };

  return (
    <Menu
      open={!!pluginAnchor}
      anchorEl={pluginAnchor}
      onClose={onClose}
    >
      {
        plugins.map(({ url, name, description, loading, error }) => (
          <MenuItem
            key={url}
            disabled={Boolean(loading || error)}
            title={t('pluginTooltip', { 
              description: error || description || '', 
              url, 
            })}
            onClick={() => {
              onClose();
              dispatchToPlugin(url);
            }}
          >
            {error && <WarningIcon color="warning" />}
            {loading && <CircularProgress color="secondary" size={22} />}
            {name || url}
          </MenuItem>
        ))
      }
    </Menu>
  );
}

export default PluginSelect;
