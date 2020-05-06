const serialportMiddleware = require('./middlewares/serialport');

module.exports = (app) => {
  app.use('/api/serial', serialportMiddleware());
};
