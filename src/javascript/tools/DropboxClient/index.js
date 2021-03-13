import { Dropbox } from 'dropbox';
import readFileAs from '../readFileAs';

class DropboxClient {
  constructor(tokens, addToQueue) {
    this.addToQueue = addToQueue;
    this.throttle = 30; // ToDo: Settings?
    this.tokens = tokens;

    const { accessToken, accessTokenExpiresAt } = tokens;

    this.dbx = new Dropbox({
      clientId: DROPBOX_APP_KEY,
      accessToken,
      accessTokenExpiresAt: new Date(accessTokenExpiresAt),
    });

    window.dbx = this.dbx;
    this.requestError = this.requestError.bind(this);
  }

  checkLoginStatus() {
    return this.dbx.auth.checkAndRefreshAccessToken()
      .then(() => {
        const accessToken = this.dbx.auth.getAccessToken();
        const accessTokenExpiresAt = this.dbx.auth.getAccessTokenExpiresAt().getTime();
        const expiresIn = accessTokenExpiresAt - (new Date()).getTime();
        return accessToken && expiresIn > 1000;
      });
  }

  requestError(error) {
    if (error.error.error_summary.startsWith('expired_access_token')) {
      this.dbx = null;
    }

    throw new Error(error);
  }

  getRemoteContents() {
    const get = ['images', 'frames'];

    return this.addToQueue('dbx.filesDownload /settings.json', this.throttle, () => (
      this.dbx.filesDownload({ path: '/settings.json' })
        .catch(this.requestError)
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
                  .catch(this.requestError)
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
        .catch(this.requestError)
    ))
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
        .catch(this.requestError)
    ))
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
          .catch(this.requestError)
      ))
    )))
      .then(() => (
        this.addToQueue(`dbx.filesDeleteBatch ${del.length} files`, this.throttle, () => (
          this.dbx.filesDeleteBatch({
            entries: del.map(({ path }) => ({ path })),
          })
            .catch(this.requestError)
        ))
          .then(({ result: { async_job_id: jobId } }) => {

            const addBatchCheck = () => this.addToQueue(`dbx.filesDeleteBatchCheck ${jobId}`, 1000, () => (
              this.dbx.filesDeleteBatchCheck({ async_job_id: jobId })
                .catch(this.requestError)
            ))
              .then(({ result: { '.tag': progress } }) => (
                progress === 'in_progress' ? addBatchCheck() : true
              ));

            return addBatchCheck();
          })
      ));
  }
}

export default DropboxClient;
