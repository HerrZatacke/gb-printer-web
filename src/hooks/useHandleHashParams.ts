import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import { useSettingsStore } from '@/stores/stores';
import { FeatureFlag } from '@/types/FeatureFlags';

export const useHandleHashParams = () => {
  const { getUrl } = useGalleryTreeContext();
  const { setFeatureFlags } = useSettingsStore();
  const hash = (typeof window === 'undefined' || window.location.hash.length < 2) ? '' : window.location.hash;

  useEffect(() => {
    if (!hash) {
      return;
    }

    const hashContent = hash.slice(1);

    const hashSegments = hashContent.split('/').filter(Boolean);
    const route = hashSegments[0];
    let goto = '';

    switch (route) {
      case 'gallery': {
        const [param, page] = hashSegments.slice(-2);
        let group: string;
        if (param === 'page') {
          group = hashSegments.slice(1, -2).join('/');
        } else {
          group = hashSegments.slice(1).join('/');
        }

        if (group.length || page?.length) {
          if (group.length) {
            group = `${group}/`;
          }
          goto = getUrl({ group, pageIndex: parseInt(page, 10) - 1 });
        } else {
          goto = '/gallery/';
        }

        break;
      }

      case 'add-plugin': {
        goto = `add-plugin/?pluginUrl=${hashSegments.slice(1).join('/')}`;

        break;
      }

      case 'settings': {
        const settingsPage = hashSegments[1];
        goto = `settings/${settingsPage}/`;
        break;
      }

      case 'home': {
        goto = '/';
        break;
      }

      case 'enableFeature': {
        console.info(`🚩 Enabling feature "${hashSegments[1]}"`);
        setFeatureFlags(hashSegments[1] as FeatureFlag, true);
        break;
      }

      case 'disableFeature': {
        console.info(`🚩 Disabling feature "${hashSegments[1]}"`);
        setFeatureFlags(hashSegments[1] as FeatureFlag, false);
        break;
      }

      default: {
        if (route?.length) {
          goto = `${hashSegments.join('/')}/`;
        }
      }
    }

    window.setTimeout(() => {
      if (goto) {
        window.location.hash = '';
        redirect(goto);
      }
    }, 10);
  }, [getUrl, hash, setFeatureFlags]);
};
