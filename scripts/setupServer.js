import initWifiProxy from './wifi-proxy-middleware/index.js';

const setupServer = (app, projectConfig) => {
  initWifiProxy(app, projectConfig);
};

export default setupServer;
