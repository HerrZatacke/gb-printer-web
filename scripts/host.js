/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const setupServer = require('./setupServer');

const port = 3000;
const app = express();

setupServer(app);

app.use(express.static(path.join(process.cwd(), 'dist')));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(chalk.green(`Example app listening at http://localhost:${port}`));
});
