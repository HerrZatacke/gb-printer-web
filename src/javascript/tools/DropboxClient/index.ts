import { Dropbox, DropboxAuth, DropboxOptions, DropboxResponse } from 'dropbox';
import { files as Files, async as Async } from 'dropbox/types/dropbox_types';
import { EventEmitter } from 'events';
import readFileAs, { ReadAs } from '../readFileAs';
import cleanPath from '../cleanPath';
import { DropBoxSettings } from '../../../types/actions/StorageActions';
import { AddToQueueFn, JSONExportState, RepoContents, RepoFile, RepoTasks } from '../../../types/Sync';

type DBFolderAll = Files.FileMetadataReference | Files.FolderMetadataReference | Files.DeletedMetadataReference;
type DBFolderFile = Files.FileMetadataReference;

const REDIRECT_URL = encodeURIComponent(`${window.location.protocol}//${window.location.host}${window.location.pathname}`);

interface UploadDeleteResult {
  uploaded: Files.FileMetadata[],
  deleted: DBFolderFile[],
}

class DropboxClient extends EventEmitter {
  private queueCallback: AddToQueueFn<DropboxResponse<unknown>>;
  private throttle: number;
  private dbx: Dropbox;
  private auth: DropboxAuth;
  private rootPath: string[];

  constructor(settings: DropBoxSettings, addToQueue: AddToQueueFn<DropboxResponse<unknown>>) {
    super();

    this.queueCallback = addToQueue;
    this.throttle = 30;
    this.rootPath = [];

    const { accessToken, expiresAt, refreshToken, path, autoDropboxSync } = settings;

    this.setRootPath(path);

    this.dbx = new Dropbox({
      clientId: DROPBOX_APP_KEY,
      accessToken,
      accessTokenExpiresAt: new Date(expiresAt || 0),
      refreshToken,
    });

    const auth = (this.dbx as DropboxOptions)?.auth;
    if (!auth) {
      throw new Error('dbx auth error');
    }

    this.auth = auth;

    if (autoDropboxSync) {
      this.startLongPollSettings();
    }

  }

  async addToQueue(...args: [
    what: string,
    throttle: number,
    fn: () => Promise<DropboxResponse<unknown>>,
    isSilent?: boolean,
  ]) {
    if (!this.auth.getAccessToken()) {
      throw new Error('not logged in');
    }

    return this.queueCallback(...args);
  }

  setRootPath(path = '') {
    this.rootPath = cleanPath(path).split('/');
  }

  toPath(path: string): string {
    const parts = [
      ...this.rootPath,
      ...path.split('/'),
    ]
      .filter(Boolean);

    return `/${parts.join('/')}`;
  }

  inSettingsPath(path: string): string {
    const rootPath = this.toPath('settings');
    return cleanPath(path.replace(rootPath, ''));
  }

  async checkLoginStatus(): Promise<boolean> {
    try {
      await this.auth.checkAndRefreshAccessToken();

      const accessToken = this.auth.getAccessToken();
      const expiresAt = this.auth.getAccessTokenExpiresAt().getTime();
      const expiresIn = expiresAt - (new Date()).getTime();

      this.emit('loginDataUpdate', {
        accessToken,
        expiresAt,
      });

      return !!accessToken && expiresIn > 1000;
    } catch (error) {
      this.auth.setAccessTokenExpiresAt(new Date(0));
      this.auth.setAccessToken('');

      throw error;
      return false;
    }
  }

  async startAuth() {
    const authUrl = (await this.auth.getAuthenticationUrl(
      REDIRECT_URL,
      undefined,
      'code',
      'offline',
      undefined,
      undefined,
      true,
    )) as string;

    window.sessionStorage.setItem('dropboxCodeVerifier', this.auth.getCodeVerifier());
    window.location.replace(authUrl);
  }

  async codeAuth(dropboxCode: string) {
    const codeVerifier = window.sessionStorage.getItem('dropboxCodeVerifier');
    if (!codeVerifier) {
      throw new Error('no codeVerifier');
    }

    this.auth.setCodeVerifier(codeVerifier);
    window.sessionStorage.removeItem('dropboxCodeVerifier');

    const response = await this.auth.getAccessTokenFromCode(REDIRECT_URL, dropboxCode);

    const {
      refresh_token: refreshToken,
      access_token: accessToken,
      expires_in: expiresIn,
    } = response.result as {
      refresh_token: string,
      access_token: string,
      expires_in: number,
    };

    const expiresAt = (new Date()).getTime() + (expiresIn * 1000);

    this.auth.setAccessToken(accessToken);
    this.auth.setAccessTokenExpiresAt(new Date(expiresAt));

    this.emit('loginDataUpdate', {
      refreshToken,
      accessToken,
      expiresAt,
    });
  }

  async getRemoteContents(direction: 'diff' | 'up' | 'down'): Promise<RepoContents> {
    const get = ['images', 'frames'];
    const isSilent = direction === 'diff';

    const loggedIn = await this.checkLoginStatus();
    if (!loggedIn) {
      throw new Error('not logged in');
    }

    const response: DropboxResponse<unknown> = await this.addToQueue('dbx.filesDownload /settings.json', this.throttle, () => (
      this.dbx.filesDownload({ path: this.toPath('/settings/settings.json') })
    ), isSilent);

    const result = response.result as (Files.FileMetadata & { fileBlob: Blob });

    const settingsText = await readFileAs(result.fileBlob, ReadAs.TEXT);
    const settings = JSON.parse(settingsText) as JSONExportState;

    const [images, frames] = await Promise.all(get.map(async (folderPath) => {
      let entries: DBFolderAll[];
      let hasMore: boolean;
      let cursor = '';

      try {
        const listResponse = (await this.addToQueue(`dbx.filesListFolder /${folderPath}`, this.throttle, () => (
          this.dbx.filesListFolder({
            path: this.toPath(`/settings/${folderPath}`),
            limit: 250,
            recursive: true,
          })
        ), isSilent)) as DropboxResponse<Files.ListFolderResult>;

        entries = listResponse.result.entries;
        hasMore = listResponse.result.has_more;
        cursor = listResponse.result.cursor;

      } catch (error) {
        entries = [];
        hasMore = false;
      }

      if (hasMore) {
        entries = entries.concat(await this.getMoreContents(cursor, isSilent));
      }

      return entries.filter(({ '.tag': tag }) => tag === 'file') as DBFolderFile[];

    }));

    return {
      images: this.augmentFileList('images', images, isSilent),
      frames: this.augmentFileList('frames', frames, isSilent),
      settings,
    };
  }

  async getImageContents() {
    let entries: DBFolderAll[];
    let hasMore: boolean;
    let cursor = '';

    try {
      const listResponse = (await this.addToQueue('dbx.filesListFolder /images', this.throttle, () => (
        this.dbx.filesListFolder({
          path: this.toPath('/images'),
          limit: 250,
          recursive: true,
        })
      ))) as DropboxResponse<Files.ListFolderResult>;

      entries = listResponse.result.entries;
      hasMore = listResponse.result.has_more;
      cursor = listResponse.result.cursor;

    } catch (error) {
      entries = [];
      hasMore = false;
    }

    if (hasMore) {
      entries = entries.concat(await this.getMoreContents(cursor));
    }

    return entries.filter(({ '.tag': tag }) => tag === 'file');
  }

  async getMoreContents(cursor: string, isSilent?: boolean): Promise<DBFolderAll[]> {
    let entries: DBFolderAll[];
    let hasMore: boolean;
    let nextCursor = '';

    try {
      const listResponse = (await this.addToQueue(`dbx.filesListFolderContinue ${cursor}`, this.throttle, () => (
        this.dbx.filesListFolderContinue({
          cursor,
        })
      ), isSilent)) as DropboxResponse<Files.ListFolderResult>;

      entries = listResponse.result.entries;
      hasMore = listResponse.result.has_more;
      nextCursor = listResponse.result.cursor;

    } catch (error) {
      entries = [];
      hasMore = false;
    }

    if (hasMore) {
      entries = entries.concat(await this.getMoreContents(nextCursor, isSilent));
    }

    return entries;
  }

  augmentFileList(type: 'images' | 'frames', files: DBFolderFile[], isSilent: boolean): RepoFile[] {
    return files.map((fileMetaReference, index): RepoFile => {
      const {
        path_lower: absolutePath,
        content_hash:
        contentHash,
        name,
      } = fileMetaReference;

      const path = absolutePath ? this.inSettingsPath(absolutePath) : '';

      let hash: string;
      switch (type) {
        case 'images':
          hash = name.split('.')[0];
          break;
        case 'frames':
          hash = name.split('.')[0];
          break;
        default:
          hash = '-';
      }

      return {
        path,
        name,
        contentHash: contentHash || '',
        hash,
        getFileContent: () => this.getFileContent(path, index, files.length, isSilent),
      };
    });
  }

  async getFileContent(path: string, index: number, total: number, isSilent = false): Promise<string> {
    const message = `dbx.filesDownload (${index + 1}/${total}) ${path}`;
    const response: DropboxResponse<unknown> = (await this.addToQueue(message, this.throttle, () => (
      this.dbx.filesDownload({ path: this.toPath(`/settings/${path}`) })
    ), isSilent));

    const result = response.result as (Files.FileMetadata & { fileBlob: Blob });

    return readFileAs(result.fileBlob, ReadAs.TEXT);
  }

  async upload(tasks: RepoTasks, toPath: 'settings' | 'images'): Promise<UploadDeleteResult> {
    const { upload, del } = tasks;

    const uploaded = await Promise.all(upload.map(async (file, index) => {
      const { result } = (await this.addToQueue(`dbx.filesUpload (${index + 1}/${upload.length}) ${file.destination}`, this.throttle, () => (
        this.dbx.filesUpload({
          path: this.toPath(`/${toPath}/${file.destination}`),
          contents: file.blob,
          mode: {
            '.tag': 'overwrite',
          },
        })
      ))) as DropboxResponse<Files.FileMetadata>;
      return result;
    }));

    if (!del.length) {
      return {
        uploaded,
        deleted: [],
      };
    }

    const { result: { async_job_id: jobId } } = (await this.addToQueue(`dbx.filesDeleteBatch ${del.length} files`, this.throttle, () => (
      this.dbx.filesDeleteBatch({
        entries: del.map(({ path }) => ({ path: this.toPath(`/settings/${path}`) })),
      })
    ))) as DropboxResponse<Async.LaunchResultBase>;

    const addBatchCheck = async (): Promise<DBFolderAll[]> => {
      const { result: { '.tag': progress, entries } } = (await this.addToQueue(`dbx.filesDeleteBatchCheck ${jobId}`, 2000, () => (
        this.dbx.filesDeleteBatchCheck({ async_job_id: jobId })
      ))) as DropboxResponse<Async.PollResultBase & Files.DeleteBatchResult>;

      if (progress === 'in_progress') {
        return addBatchCheck();
      }


      return entries.map((entry) => (
        (entry as Files.DeleteBatchResultEntrySuccess).metadata
      ));
    };

    const deleted = (await addBatchCheck()) as DBFolderFile[];

    return {
      uploaded,
      deleted,
    };
  }

  startLongPollSettings() {
    // eslint-disable-next-line no-console
    console.info('Start dropbox longpolling');

    this.dbx.filesListFolderGetLatestCursor({
      path: this.toPath('/settings'),
      recursive: false,
      include_media_info: false,
      include_deleted: false,
      include_has_explicit_shared_members: false,
    })
      .then(({ result: { cursor } }) => {

        const longPoll = () => this.dbx.filesListFolderLongpoll({
          cursor,
          timeout: 480,
        });

        return longPoll()
          .then(({ result: { changes } }) => {
            // eslint-disable-next-line no-console
            console.info('Longpoll info. Changes: ', changes);

            if (changes) {
              this.emit('settingsChanged');
              return this.addToQueue('Restart longpolling', this.throttle, () => {
                this.startLongPollSettings();
                return Promise.resolve(null as unknown as DropboxResponse<unknown>);
              }, true);
            }

            return longPoll();
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export default DropboxClient;
