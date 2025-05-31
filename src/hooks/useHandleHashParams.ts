import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useGalleryParams } from '@/hooks/useGalleryParams';

export const useHandleHashParams = () => {
  const { getUrl } = useGalleryParams();

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
        break;
      }

      default: {
        if (route?.length) {
          goto = `${hashSegments.join('/')}/`;
        }
      }
    }

    window.location.hash = '';
    window.setTimeout(() => {
      redirect(goto);
    }, 10);
  }, [getUrl, hash]);
};
