const serialportWebsocket = require('./sockets/serialport');
const initWifiProxy = require('./wifi-proxy-middleware');

module.exports = (app) => {
  serialportWebsocket(app);
  initWifiProxy(app);
};
