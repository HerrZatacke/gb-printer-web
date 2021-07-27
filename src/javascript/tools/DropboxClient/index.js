import { Dropbox } from 'dropbox';
import { EventEmitter } from 'events';
import readFileAs from '../readFileAs';
import cleanPath from '../cleanPath';

const REDIRECT_URL = encodeURIComponent(`${window.location.protocol}//${window.location.host}${window.location.pathname}`);

class DropboxClient extends EventEmitter {
  constructor(settings, addToQueue) {
    super();

    this.queueCallback = addToQueue;
    this.throttle = 30;

    const { accessToken, expiresAt, refreshToken, path } = settings;

    this.setRootPath(path);

    this.dbx = new Dropbox({
      clientId: DROPBOX_APP_KEY,
      accessToken,
      accessTokenExpiresAt: new Date(expiresAt),
      refreshToken,
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

  setRootPath(path = '') {
    this.rootPath = cleanPath(path).split('/');
  }

  toPath(path) {
    const parts = [
      ...this.rootPath,
      ...path.split('/'),
    ]
      .filter(Boolean);

    return `/${parts.join('/')}`;
  }

  inSettingsPath(path) {
    const rootPath = this.toPath('settings');
    return cleanPath(path.replace(rootPath, ''));
  }

  checkLoginStatus() {
    // noinspection JSVoidFunctionReturnValueUsed
    return this.dbx.auth.checkAndRefreshAccessToken()
      .catch(this.requestError)
      .then(() => {
        const accessToken = this.dbx.auth.getAccessToken();
        const expiresAt = this.dbx.auth.getAccessTokenExpiresAt().getTime();
        const expiresIn = expiresAt - (new Date()).getTime();

        this.emit('loginDataUpdate', {
          accessToken,
          expiresAt,
        });

        return accessToken && expiresIn > 1000;
      })
      .catch(() => false);
  }

  startAuth() {
    this.dbx.auth.getAuthenticationUrl(REDIRECT_URL, undefined, 'code', 'offline', undefined, undefined, true)
      .then((authUrl) => {
        window.sessionStorage.setItem('dropboxCodeVerifier', this.dbx.auth.getCodeVerifier());
        window.location.replace(authUrl);
      });
  }

  codeAuth(dropboxCode) {
    this.dbx.auth.setCodeVerifier(window.sessionStorage.getItem('dropboxCodeVerifier'));
    window.sessionStorage.removeItem('dropboxCodeVerifier');

    this.dbx.auth.getAccessTokenFromCode(REDIRECT_URL, dropboxCode)
      .then((response) => {

        const {
          refresh_token: refreshToken,
          access_token: accessToken,
          expires_in: expiresIn,
        } = response.result;

        const expiresAt = (new Date()).getTime() + (expiresIn * 1000);

        this.dbx.auth.setAccessToken(response.result.access_token);
        this.dbx.auth.setAccessTokenExpiresAt(new Date(expiresAt));

        this.emit('loginDataUpdate', {
          refreshToken,
          accessToken,
          expiresAt,
        });
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
          this.dbx.filesDownload({ path: this.toPath('/settings/settings.json') })
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
                      path: this.toPath(`/settings/${folderPath}`),
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

  getImageContents() {
    return this.addToQueue('dbx.filesListFolder /images', this.throttle, () => (
      this.dbx.filesListFolder({
        path: this.toPath('/images'),
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
    return files.map(({ path_lower: absolutePath, name }, index) => {
      const path = this.inSettingsPath(absolutePath);
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

  getFileContent(path, index, total, silent = false) {
    const message = silent ? '' : `dbx.filesDownload (${index + 1}/${total}) ${path}`;
    return this.addToQueue(message, this.throttle, () => (
      this.dbx.filesDownload({ path: this.toPath(`/settings/${path}`) })
        .catch(this.requestError)
    ))
      .then(({ result: { fileBlob } }) => readFileAs(fileBlob, 'text'));
  }

  upload({ upload = [], del = [] }, toPath) {
    return Promise.all([
      // Upload updated files
      !upload.length ? [] : (
        Promise.all(upload.map((file, index) => (
          this.addToQueue(`dbx.filesUpload (${index + 1}/${upload.length}) ${file.destination}`, this.throttle, () => (
            this.dbx.filesUpload({
              path: this.toPath(`/${toPath}/${file.destination}`),
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
            entries: del.map(({ path }) => ({ path: this.toPath(`/settings/${path}`) })),
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
