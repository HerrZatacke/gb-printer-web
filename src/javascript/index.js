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

  const socket = new Socket({
    onMessage: (message) => {
      log(`${message}`);
      decoder.line(message);
    },
  });

  if (urlField.value) {
    socket.connect(`ws://${urlField.value}/`);
  }

  connect.addEventListener('click', () => {
    socket.connect(`ws://${urlField.value}/`);
  });

});
