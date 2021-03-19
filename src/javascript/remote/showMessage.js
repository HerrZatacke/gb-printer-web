const showMessage = ({ isIframe, isPopup, isRemote }) => {
  const messages = [...document.querySelectorAll('.remote-info')];

  [...document.querySelectorAll('.remote-info--ip')].forEach((node) => {
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
