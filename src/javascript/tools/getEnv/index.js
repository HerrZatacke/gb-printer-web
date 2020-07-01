let envData = null;

const loadEnv = () => {
  if (envData) {
    return Promise.resolve(envData);
  }

  return fetch('./env.json')
    .then((res) => res.json())
    .catch(() => ({
      version: '0.0.0',
      maximages: 0,
      env: 'error',
      fstype: '-',
      bootmode: '-',
      oled: false,
    }))
    .then((env) => {
      envData = env;
    });
};

const getEnv = () => envData;

export {
  loadEnv,
  getEnv,
};
