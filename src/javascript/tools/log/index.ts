const logNode = document.querySelector('pre');

const log = (message: string): void => {
  // Cut off the log after 420 lines (should be enough for 1 image) for performance reasons
  const lines = logNode?.innerText.split('\n').slice(-420) || [];
  if (!lines.length || !logNode) {
    return;
  }

  lines.push(message);
  logNode.innerText = lines.join('\n');
  logNode.scrollTo(0, logNode.scrollHeight);
};

export default log;
