import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropbox } from 'dropbox';
import readFileAs from '../../../../../tools/readFileAs';

const DropBoxSettings = ({ dropboxToken, logout }) => {
  const [dropboxInstance, setDropboxInstance] = useState(null);
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    if (dropboxToken) {
      setDropboxInstance(new Dropbox({ accessToken: dropboxToken }));
    } else {
      setDropboxInstance(new Dropbox({ clientId: DROPBOX_APP_KEY }));
    }
  }, [dropboxToken]);

  return (
    <>
      <textarea
        style={{
          width: '100%',
          height: '80px',
        }}
        value={fileContent}
        onChange={({ target: { value } }) => setFileContent(value)}
      />
      <div>
        { dropboxInstance ? (
          <>
            <button
              type="button"
              className="button"
              disabled={!!dropboxToken}
              onClick={() => {
                dropboxInstance.auth.getAuthenticationUrl(encodeURIComponent(`${window.location.protocol}//${window.location.host}/`), 'dropbox')
                  .catch(logout)
                  .then((authUrl) => {
                    window.location.replace(authUrl);
                  });
              }}
            >
              Authenticate
            </button>
            <button
              type="button"
              className="button"
              disabled={!dropboxToken}
              onClick={logout}
            >
              Logout
            </button>
            <button
              type="button"
              className="button"
              disabled={!dropboxToken}
              onClick={() => {
                dropboxInstance.filesUpload({
                  path: '/test.txt',
                  // eslint-disable-next-line no-alert
                  contents: fileContent,
                  mode: 'overwrite',
                  // autorename
                })
                  .catch(logout)
                  .then((response) => {
                    console.log(response);
                  });
              }}
            >
              Write
            </button>
            <button
              type="button"
              className="button"
              disabled={!dropboxToken}
              onClick={() => {
                dropboxInstance.filesDownload({ path: '/test.txt' })
                  .catch(logout)
                  .then(({ result }) => (
                    readFileAs(result.fileBlob, 'text')
                      .then(setFileContent)
                  ))
                  .catch((error) => {
                    console.log(error);
                  });
              }}
            >
              Read
            </button>
          </>
        ) : null}
      </div>
    </>
  );
};

DropBoxSettings.propTypes = {
  logout: PropTypes.func.isRequired,
  dropboxToken: PropTypes.string,
};

DropBoxSettings.defaultProps = {
  dropboxToken: null,
};

export default DropBoxSettings;
