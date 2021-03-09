import { Dropbox } from 'dropbox';

class DropboxClient {
  constructor(dropboxToken) {
    this.dbx = new Dropbox({
      accessToken: dropboxToken,
    });
  }

  getRemoteContents() {
    return Promise.resolve({
      images: [],
      png: [],
      frames: [],
      settings: {},
    });
  }

  upload({ upload = [], del = [] }) {
    // eslint-disable-next-line no-console
    console.log({ upload, del });
  }
}

export default DropboxClient;


/*
  dropboxInstance.filesUpload({
    path: '/test.txt',
    // eslint-disable-next-line no-alert
    contents: fileContent,
    mode: 'overwrite',
    // autorename
  })
    .catch(logout)
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log(response);
    });

  dropboxInstance.filesDownload({ path: '/test.txt' })
    .catch(logout)
    .then(({ result }) => (
      readFileAs(result.fileBlob, 'text')
        .then(setFileContent)
    ))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });

*/
