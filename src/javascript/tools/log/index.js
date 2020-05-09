const logNode = document.querySelector('pre');

const index = (message) => {
  logNode.innerText += `${message}\n`;
  logNode.scrollTo(0, logNode.scrollHeight);
};

export default index;
