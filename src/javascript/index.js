import 'babel-polyfill/dist/polyfill';
import '../scss/index.scss';
import Decoder from './tools/Decoder';
import Socket from './tools/Socket';
import log from './tools/log';

document.addEventListener('DOMContentLoaded', () => {

  const decoder = new Decoder({
    canvas: document.querySelector('canvas'),
  });

  const urlField = document.querySelector('input.url');
  const connect = document.querySelector('button.connect');
  const mock = document.querySelector('button.mock');

  const socket = new Socket({
    onMessage: (message) => {
      message.split('\n')
        .forEach((line) => {
          log(line);
          decoder.line(line);
        });
    },
  });

  if (urlField.value) {
    socket.connect(`ws://${urlField.value}/`);
  }

  connect.addEventListener('click', () => {
    socket.connect(`ws://${urlField.value}/`);
  });

  mock.addEventListener('click', () => {
    fetch('/mock')
      .then((res) => res.json())
      // eslint-disable-next-line no-console
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
  });

});
