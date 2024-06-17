import path from 'path';
import express from 'express';
import chalk from 'chalk';
import setupServer from './setupServer.js';

const port = 3000;
const app = express();

setupServer(app);

app.use(express.static(path.join(process.cwd(), 'dist')));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(chalk.green(`Example app listening at http://localhost:${port}`));
});
