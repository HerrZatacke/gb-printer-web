const initLog = (msg: string): void => {
  const logList = document.getElementById('loading-log');
  const entry = document.createElement('li');
  entry.innerText = msg;
  logList?.appendChild(entry);
};

export default initLog;
