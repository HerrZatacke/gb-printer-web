/* eslint-disable @typescript-eslint/no-var-requires */
const initWifiProxy = require('./wifi-proxy-middleware');

module.exports = (app) => {
  initWifiProxy(app);
};
