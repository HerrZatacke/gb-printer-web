const readFileAs = (file, readAs) => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = ({ target }) => {
      if (target.result) {
        if (readAs === 'arrayBuffer') {
          resolve(Buffer.from(target.result));
          return;
        }

        resolve(target.result);
        return;
      }

      reject(new Error('Filereader has no result'));
    };

    reader.onerror = (error) => {
      reject(error);
    };

    switch (readAs) {
      case 'arrayBuffer':
        reader.readAsArrayBuffer(file);
        break;
      case 'text':
        reader.readAsText(file);
        break;
      case 'binaryString':
        reader.readAsBinaryString(file);
        break;
      case 'dataURL':
        reader.readAsDataURL(file);
        break;
      default:
        reject(new Error(`readAs param missing or unknown type "${readAs}"`));
    }

  })
);

export default readFileAs;
