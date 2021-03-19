const startHeartbeat = ({ targetWindow }, commands) => {

  const heartBeat = () => {
    targetWindow.postMessage({
      fromRemotePrinter: {
        height: document.body.getBoundingClientRect().height,
        commands,
      },
    }, '*');
  };

  window.setInterval(heartBeat, 500);
  heartBeat();
};

export default startHeartbeat;
