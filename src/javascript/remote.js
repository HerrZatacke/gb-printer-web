import '../scss/remote.scss';
import getRemoteEnv from './remote/getRemoteEnv';
import showMessage from './remote/showMessage';
import setClasses from './remote/setClasses';
import startHeartbeat from './remote/startHeartbeat';
import initCommands from './remote/initCommands';
import { loadEnv } from './tools/getEnv';

const remoteEnv = getRemoteEnv();

document.addEventListener('DOMContentLoaded', () => {

  showMessage(remoteEnv);
  setClasses(remoteEnv);

  if (!remoteEnv.isRemote) {
    return;
  }

  loadEnv()
    .then(({ env }) => {

      const commands = initCommands(remoteEnv, env);
      startHeartbeat(remoteEnv, commands.map(({ name }) => name));
    });

});
