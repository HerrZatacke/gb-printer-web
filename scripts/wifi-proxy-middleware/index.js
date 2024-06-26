import { createProxyMiddleware } from 'http-proxy-middleware';
import conf from '../../config.json' assert { type: 'json' };

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

export default initWifiProxy;
