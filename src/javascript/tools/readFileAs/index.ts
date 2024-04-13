export enum ReadAs {
  UINT8_ARRAY = 'uint8array',
  TEXT = 'text',
  DATA_URL = 'dataURL',
  BINARY_STRING = 'binaryString',
}

function readFileAs(file: File, readAs: ReadAs.UINT8_ARRAY): Promise<Uint8Array>;
function readFileAs(file: File, readAs: ReadAs.TEXT): Promise<string>;
function readFileAs(file: File, readAs: ReadAs.DATA_URL): Promise<string>;
function readFileAs(file: File, readAs: ReadAs.BINARY_STRING): Promise<string>;

function readFileAs(file: File, readAs: ReadAs): Promise<Uint8Array | string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = ({ target }) => {
      if (target?.result) {
        if (readAs === ReadAs.UINT8_ARRAY) {
          resolve(Buffer.from(target.result as ArrayBuffer));
          return;
        }

        resolve(target.result as string);
        return;
      }

      reject(new Error('Filereader has no result'));
    };

    reader.onerror = (error) => {
      reject(error);
    };

    switch (readAs) {
      case ReadAs.UINT8_ARRAY:
        reader.readAsArrayBuffer(file);
        break;
      case ReadAs.TEXT:
        reader.readAsText(file);
        break;
      case ReadAs.BINARY_STRING:
        reader.readAsBinaryString(file);
        break;
      case ReadAs.DATA_URL:
        reader.readAsDataURL(file);
        break;
      default:
        reject(new Error(`readAs param missing or unknown type "${readAs}"`));
    }
  });
}

export default readFileAs;
