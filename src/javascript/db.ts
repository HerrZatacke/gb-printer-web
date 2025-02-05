import { initDbTransfer } from './database';
import '../scss/index.scss';

document.addEventListener('DOMContentLoaded', async () => {
  await initDbTransfer(window.opener);
});
