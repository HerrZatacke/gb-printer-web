import React from 'react';
import { createRoot } from 'react-dom/client';
import useFiltersStore from './stores/filtersStore';
import useItemsStore from './stores/itemsStore';

const initApp = async () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  const { default: App } = await import(/* webpackChunkName: "app" */ './components/App');

  try {
    const root = createRoot(appRoot);

    const { images } = useItemsStore.getState();
    useFiltersStore.getState().cleanRecentImports((images || []).map(({ hash }) => hash));

    root.render(<App />);
  } catch (error) {
    const appNode = document.getElementById('app');

    if (appNode) {
      appNode.innerHTML =
        `<p class="init-error">Error while initializing the app:<br>${(error as Error).message}<br><small>${(error as Error).stack}</small></p>`;
    }
  }
};

export default initApp;
