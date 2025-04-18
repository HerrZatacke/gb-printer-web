import { createProxyMiddleware } from 'http-proxy-middleware';

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

const initWifiProxy = (app, projectConfig) => {
  if (!projectConfig || !projectConfig.wifiproxy) {
    return;
  }

  // eslint-disable-next-line no-console
  console.info(`Initializing wifi proxy to "${projectConfig.wifiproxy}"`);

  const wifiProxy = createProxyMiddleware({
    target: `${projectConfig.wifiproxy}/wificonfig`,
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
