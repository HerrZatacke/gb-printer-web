const blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer();
  }

  return new Promise(((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = (ev) => {
      if (!ev.target) {
        throw new Error('no file');
      }

      const result = ev.target.result;

      if (typeof result === 'string' || result === null) {
        throw new Error('unexpected filereader result');
      }

      resolve(result);
    };

    fileReader.readAsArrayBuffer(blob);
  }));
};

export default blobToArrayBuffer;
