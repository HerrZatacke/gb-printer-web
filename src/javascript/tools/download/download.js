import { saveAs } from 'file-saver';

const download = (zipFileName) => (files) => {

  // if only one file,
  if (files.length === 1) {
    const image = files[0];
    saveAs(image.blob, image.filename);
    return;
  }

  import(/* webpackChunkName: "jszip" */ 'jszip')
    .then(({ default: JSZip }) => {
      const zip = new JSZip();

      files.forEach(({ filename, arrayBuffer }) => {
        zip.file(filename, arrayBuffer);
      });

      zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
      })
        .then((content) => {
          saveAs(content, `${zipFileName}.zip`);
        });
    });
};

export default download;
