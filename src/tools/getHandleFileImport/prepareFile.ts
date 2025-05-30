interface OldFile {
  blob: Blob,
  blobName?: string,
  contentType?: string,
  ok?: boolean,
}

export interface PreparedFile {
  file: File,
  contentType: string,
}

const prepareFile = (fileData: File | OldFile): PreparedFile => {
  let file: File;
  let contentType: string;

  if ((fileData as OldFile).blob) {
    // As of version 1.16.4 the filedata is an object like { blob, contentType }
    // earlier versions (and the NeoGB Printer) directly provide a blob
    const oldFile: OldFile = (fileData as OldFile);
    file = new File([oldFile.blob], oldFile.blobName || 'blob');

    contentType = oldFile.contentType || 'application/unknown';

    // v1.16.4 is missing the 'ok' property, hence the explicit check (may be removed in future versions if v0.3.5+ is successful)
    if (oldFile.ok !== undefined && !oldFile.ok) {
      throw new Error('Invalid file received from printer');
    }

  } else {
    file = fileData as File;
    contentType = file.type;
  }

  if (!file.size) {
    throw new Error('empty file');
  }

  return {
    file,
    contentType,
  };
};

export default prepareFile;
