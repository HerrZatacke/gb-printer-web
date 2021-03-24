const initWifiProxy = require('./wifi-proxy-middleware');

module.exports = (app) => {
  initWifiProxy(app);
};
