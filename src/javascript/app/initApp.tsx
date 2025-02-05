import React from 'react';
import { createRoot } from 'react-dom/client';
import useFiltersStore from './stores/filtersStore';
import useItemsStore from './stores/itemsStore';
import { migrateLegacy } from './stores/migrations/legacy';
import { generateDebugImages } from '../tools/generateDebugImages';

const initApp = async () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  migrateLegacy();

  const { default: App } = await import(/* webpackChunkName: "app" */ './components/App');

  try {
    const root = createRoot(appRoot);

    const { images } = useItemsStore.getState();
    useFiltersStore.getState().cleanRecentImports((images || []).map(({ hash }) => hash));

    root.render(<App />);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.startFake = async (count: number) => {
      await generateDebugImages(count);
    };
  } catch (error) {
    const appNode = document.getElementById('app');

    if (appNode) {
      appNode.innerHTML =
        `<p class="init-error">Error while initializing the app:<br>${(error as Error).message}<br><small>${(error as Error).stack}</small></p>`;
    }
  }
};

export default initApp;
