const prepareFile = (fileData) => {
  let file = fileData;
  let contentType = fileData.type;
  let meta = null;
  let ok = true;

  console.log(file);

  // As of version 1.16.4 the filedata is an object like { blob, contentType }
  // earlier versions directly provide a blob
  if (fileData.blob) {
    file = fileData.blob;
    file.name = fileData.blobName;
    contentType = fileData.contentType || 'application/unknown';
    meta = fileData.meta;
    // v1.16.4 is missing the 'ok' property, hence the explicit check (may be removed in future versions if v0.3.5+ is successful)
    ok = (fileData.ok !== undefined) ? fileData.ok : ok;
  }

  if (!ok || !file.size) {
    throw new Error('Error in received data');
  }

  return {
    file,
    contentType,
    meta,
  };
};

export default prepareFile;
