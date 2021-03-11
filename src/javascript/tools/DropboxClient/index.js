import { Dropbox } from 'dropbox';
import readFileAs from '../readFileAs';

class DropboxClient {
  constructor(dropboxToken, addToQueue) {
    this.addToQueue = addToQueue;
    this.throttle = 30; // ToDo: Settings?
    this.dbx = new Dropbox({
      accessToken: dropboxToken,
    });

    window.dbx = this.dbx;
    this.requestError = this.requestError.bind(this);
    this.logError = this.logError.bind(this);
    this.log = this.log.bind(this);
  }

  requestError(error) {
    console.log(error);
    return null;
  }

  logError(error) {
    console.log(error);
    return null;
  }

  log(data) {
    console.log(data);
    return data;
  }

  getRemoteContents() {
    const get = ['images', 'frames'];

    return this.addToQueue('dbx.filesDownload /settings.json', this.throttle, () => (
      this.dbx.filesDownload({ path: '/settings.json' })
    ))
      .catch(() => ({ result: { fileBlob: new Blob([...'{}'], { type: 'text/plain' }) } }))
      .then(({ result: { fileBlob } }) => (
        readFileAs(fileBlob, 'text')
          .then((settingsText) => JSON.parse(settingsText))
          .then((settings) => (
            Promise.all(get.map((folderPath) => (
              this.addToQueue(`dbx.filesListFolder /${folderPath}`, this.throttle, () => (
                this.dbx.filesListFolder({
                  path: `/${folderPath}`,
                  limit: 250,
                  recursive: true,
                })
              ))
                .catch(() => ({ result: { entries: [], has_more: false } }))
                .then(({ result: { entries, has_more: hasMore, cursor } }) => (
                  (
                    hasMore ?
                      this.getMoreContents(cursor, entries) :
                      Promise.resolve(entries)
                  )
                    .then((allEntries) => (
                      allEntries.filter(({ '.tag': tag }) => tag === 'file')
                    ))
                ))
            )))
              .then(([images, frames]) => ({
                images: this.augmentFileList('images', images),
                frames: this.augmentFileList('frames', frames),
                settings,
              }))
          ))
      ));
  }

  getMoreContents(cursor, prevEntries) {
    return this.addToQueue(`dbx.filesListFolderContinue ${cursor}`, this.throttle, () => (
      this.dbx.filesListFolderContinue({
        cursor,
      })
    ))
      .catch(this.requestError)
      .then(({ result: { entries, has_more: hasMore, cursor: nextCursor } }) => {
        const allEntries = prevEntries.concat(entries);
        return hasMore ? this.getMoreContents(nextCursor, allEntries) : allEntries;
      });
  }

  augmentFileList(type, files) {
    return files.map(({ path_lower: path, name }, index) => {
      const augmentedFile = {
        path,
        name,
        getFileContent: () => this.getFileContent(path, index, files.length),
      };

      switch (type) {
        case 'images':
          return Object.assign(augmentedFile, {
            hash: name.substr(0, 40),
          });
        case 'frames':
          return Object.assign(augmentedFile, {
            id: name.match(/^[a-z]+[0-9]+/gi)[0],
          });
        default:
          return augmentedFile;
      }
    });
  }

  getFileContent(path, index, total) {
    return this.addToQueue(`dbx.filesDownload (${index + 1}/${total}) ${path}`, this.throttle, () => (
      // ToDo: try:
      // filesDownloadZip
      this.dbx.filesDownload({ path })
    ))
      .catch(this.requestError)
      .then(({ result: { fileBlob } }) => readFileAs(fileBlob, 'text'));
  }

  upload({ upload = [], del = [] }) {
    // eslint-disable-next-line no-console
    console.log({ upload, del });

    return Promise.all(upload.map((file, index) => (
      // ToDo: try:
      // uploadSessionStart
      // uploadSessionAppendV2
      // filesUploadSessionFinishBatch
      this.addToQueue(`dbx.filesUpload (${index + 1}/${upload.length}) ${file.destination}`, this.throttle, () => (
        this.dbx.filesUpload({
          path: `/${file.destination}`,
          contents: file.blob,
          mode: 'overwrite',
        })
      ))
        .catch(this.requestError)
    )))
      .then(() => (
        // ToDo: try:
        // filesDeleteBatch
        // filesDeleteBatchCheck
        Promise.all(del.map(({ path }, index) => (
          this.addToQueue(`dbx.filesDeleteV2 (${index + 1}/${del.length}) ${path}`, this.throttle, () => (
            this.dbx.filesDeleteV2({ path })
          ))
            .catch(this.requestError)
        )))
      ));
  }
}

export default DropboxClient;
