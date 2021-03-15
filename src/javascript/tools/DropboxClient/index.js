import { Dropbox } from 'dropbox';
import readFileAs from '../readFileAs';

class DropboxClient {
  constructor(tokens, addToQueue) {
    this.queueCallback = addToQueue;
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

  addToQueue(...args) {
    if (!this.dbx.auth.getAccessToken()) {
      return Promise.reject();
    }

    return this.queueCallback(...args);
  }

  checkLoginStatus() {
    return this.dbx.auth.checkAndRefreshAccessToken()
      .catch(this.requestError)
      .then(() => {
        const accessToken = this.dbx.auth.getAccessToken();
        const accessTokenExpiresAt = this.dbx.auth.getAccessTokenExpiresAt().getTime();
        const expiresIn = accessTokenExpiresAt - (new Date()).getTime();
        return accessToken && expiresIn > 1000;
      })
      .catch(() => false);
  }

  startAuth() {
    this.dbx.auth.getAuthenticationUrl(encodeURIComponent(`${window.location.protocol}//${window.location.host}/`))
      .then((authUrl) => {
        window.location.replace(authUrl);
      });
  }

  requestError(error) {
    if (error.error.error_summary.startsWith('expired_access_token')) {
      this.dbx.auth.setAccessTokenExpiresAt(new Date(0));
      this.dbx.auth.setAccessToken(null);
    }

    throw new Error(error);
  }

  getRemoteContents() {
    const get = ['images', 'frames'];

    return this.checkLoginStatus()
      .then((loggedIn) => {
        if (!loggedIn) {
          throw new Error('not logged in');
        }

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
      });
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
      this.dbx.filesDownload({ path })
        .catch(this.requestError)
    ))
      .then(({ result: { fileBlob } }) => readFileAs(fileBlob, 'text'));
  }

  upload({ upload = [], del = [] }) {
    return Promise.all([
      // Upload updated files
      !upload.length ? [] : (
        Promise.all(upload.map((file, index) => (
          this.addToQueue(`dbx.filesUpload (${index + 1}/${upload.length}) ${file.destination}`, this.throttle, () => (
            this.dbx.filesUpload({
              path: `/${file.destination}`,
              contents: file.blob,
              mode: 'overwrite',
            })
              .catch(this.requestError)
          ))
            .then(({ result }) => result)
        )))
      ),

      // Delete unused files
      !del.length ? [] : (
        this.addToQueue(`dbx.filesDeleteBatch ${del.length} files`, this.throttle, () => (
          this.dbx.filesDeleteBatch({
            entries: del.map(({ path }) => ({ path })),
          })
            .catch(this.requestError)
        ))
          .then(({ result: { async_job_id: jobId } }) => {

            const addBatchCheck = () => this.addToQueue(`dbx.filesDeleteBatchCheck ${jobId}`, 2000, () => (
              this.dbx.filesDeleteBatchCheck({ async_job_id: jobId })
                .catch(this.requestError)
            ))
              .then(({ result: { '.tag': progress, entries } }) => (
                progress === 'in_progress' ? addBatchCheck() : entries.map(({ metadata }) => metadata)
              ));

            return addBatchCheck();
          })
      ),
    ])
      .then(([uploaded, deleted]) => {
        // eslint-disable-next-line no-console
        console.log({
          uploaded,
          deleted,
        });
      });
  }
}

export default DropboxClient;
