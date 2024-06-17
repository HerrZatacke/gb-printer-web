import initWifiProxy from './wifi-proxy-middleware/index.js';

const setupServer = (app) => {
  initWifiProxy(app);
};

export default setupServer;
