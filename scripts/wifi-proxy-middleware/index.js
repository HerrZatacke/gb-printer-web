/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');
const conf = require('../../config');

const mockResponse = {
  mdns: 'mockprinter',
  networks: [
    {
      delete: false,
      ssid: 'mocknetwork',
    },
  ],
  ap: {
    ssid: 'mockprinter',
  },
};

const initWifiProxy = (app) => {
  if (!conf || !conf.wifiproxy) {
    return;
  }

  const wifiProxy = createProxyMiddleware({
    target: conf.wifiproxy,
    changeOrigin: true,
    onError: (error, req, res) => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(mockResponse));
    },
  });

  app.use('/wificonfig', wifiProxy);
};

module.exports = initWifiProxy;
