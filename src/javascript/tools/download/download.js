import { saveAs } from 'file-saver';
import blobArrayBuffer from '../blobArrayBuffer';

const download = (zipFileName) => (files) => {

  // if only one file,
  if (files.length === 1) {
    const image = files[0];
    saveAs(image.blob, image.filename);
    return;
  }

  import(/* webpackChunkName: "jsz" */ 'jszip')
    .then(({ default: JSZip }) => {
      const zip = new JSZip();

      Promise.all(files.map(({ filename, blob }) => (
        blobArrayBuffer(blob)
          .then((arrayBuffer) => ({
            filename,
            arrayBuffer,
          }))
      )))
        .then((buffersFiles) => {
          buffersFiles.forEach(({ filename, arrayBuffer }) => {
            zip.file(filename, arrayBuffer);
          });
        })
        .then(() => (
          zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
          })
            .then((content) => {
              saveAs(content, `${zipFileName}.zip`);
            })
        ));
    });
};

export default download;
