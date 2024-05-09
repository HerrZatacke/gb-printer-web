import { RemoteEnv } from '../../types/Printer';

const showMessage = ({ isIframe, isPopup, isRemote }: RemoteEnv): void => {
  const messages: NodeListOf<HTMLElement> = document.querySelectorAll('p.remote-info');
  const hostMessages: NodeListOf<HTMLElement> = document.querySelectorAll('.remote-info--ip');

  hostMessages.forEach((node) => {
    // eslint-disable-next-line no-param-reassign
    node.innerText = window.location.host;
  });

  messages.forEach((messageNode) => {
    const parentType = messageNode.dataset.parent;

    switch (parentType) {
      case 'none':
        if (!isRemote) {
          // eslint-disable-next-line no-param-reassign
          messageNode.style.display = 'block';
        }

        break;

      case 'iframe':
        if (isIframe) {
          // eslint-disable-next-line no-param-reassign
          messageNode.style.display = 'block';
        }

        break;

      case 'popup':
        if (isPopup) {
          // eslint-disable-next-line no-param-reassign
          messageNode.style.display = 'block';
        }

        break;
      default:
        break;
    }
  });
};

export default showMessage;
