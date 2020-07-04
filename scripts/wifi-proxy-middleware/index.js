const proxy = require('http-proxy-middleware');
const conf = require('../../config');

const initWifiProxy = (app) => {
  if (!conf || !conf.wifiproxy) {
    return;
  }

  const wifiProxy = proxy('/wificonfig', {
    target: conf.wifiproxy,
    changeOrigin: true,
  });

  app.use(wifiProxy);
};

module.exports = initWifiProxy;
