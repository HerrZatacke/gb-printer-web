import '../scss/remote.scss';
import getRemoteEnv from './remote/getRemoteEnv';
import showMessage from './remote/showMessage';
import setClasses from './remote/setClasses';
import startHeartbeat from './remote/startHeartbeat';
import initCommands from './remote/initCommands';
import { loadEnv } from './tools/getEnv';
import getParams from './remote/getParams';

const remoteEnv = getRemoteEnv();

document.addEventListener('DOMContentLoaded', async () => {
  showMessage(remoteEnv);
  setClasses(remoteEnv);

  if (!remoteEnv.isRemote) {
    return;
  }

  const { env } = await loadEnv();
  const commands = initCommands(remoteEnv, env, getParams());
  startHeartbeat(remoteEnv, commands.map(({ name }) => name));
});
