import { RemoteEnv, RemotePrinterEvent } from '../../types/Printer';

const startHeartbeat = ({ targetWindow }: RemoteEnv, commands: string[]) => {

  const heartBeat = () => {
    targetWindow.postMessage({
      fromRemotePrinter: {
        height: document.body.getBoundingClientRect().height,
        commands,
      },
    } as RemotePrinterEvent, '*');
  };

  window.setInterval(heartBeat, 500);
  heartBeat();
};

export default startHeartbeat;
