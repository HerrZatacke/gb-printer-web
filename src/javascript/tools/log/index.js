const logNode = document.querySelector('pre');

const index = (message) => {
  // Cut off the log after 420 lines (should be enough for 1 image) for performance reasons
  const lines = logNode.innerText.split('\n').slice(-420);
  lines.push(message);
  logNode.innerText = lines.join('\n');
  logNode.scrollTo(0, logNode.scrollHeight);
};

export default index;
