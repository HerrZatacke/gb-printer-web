const blobArrayBuffer = (blob) => {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer();
  }

  return new Promise(((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = (ev) => {
      resolve(ev.target.result);
    };

    fileReader.readAsArrayBuffer(blob);
  }));
};

export default blobArrayBuffer;
