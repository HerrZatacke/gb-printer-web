const startHeartbeat = ({ targetWindow }, commands) => {
  window.setInterval(() => {
    targetWindow.postMessage({
      fromRemotePrinter: {
        height: document.body.getBoundingClientRect().height,
        commands,
      },
    }, '*');
  }, 500);
};

export default startHeartbeat;
