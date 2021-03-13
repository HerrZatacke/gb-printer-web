import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Lightbox from '../Lightbox';

dayjs.extend(duration);

const ProgressLogBox = ({
  git: {
    messages: gitMessages,
    repoUrl,
    repo,
    branch,
  },
  dropbox: {
    messages: dropboxMessages,
  },
  confirm,
}) => {
  if (
    !gitMessages.length &&
    !dropboxMessages.length

  ) {
    return null;
  }

  const isGit = gitMessages.length > 0;
  const isDropbox = dropboxMessages.length > 0;

  const { timestamp: gitTimeStart } = gitMessages[gitMessages.length - 1] || {};
  const { timestamp: gitTimeLatest, message: gitLatestMessage } = gitMessages[0] || {};

  const { timestamp: dropboxTimeStart } = dropboxMessages[dropboxMessages.length - 1] || {};
  const { timestamp: dropboxTimeLatest, message: dropboxLatestMessage } = dropboxMessages[0] || {};

  const gitFinished = gitLatestMessage === '.';
  const dropboxFinished = dropboxLatestMessage === '.';
  const finished = gitFinished || dropboxFinished;

  const timeStart = isGit ? gitTimeStart : dropboxTimeStart;
  const timeLatest = isGit ? gitTimeLatest : dropboxTimeLatest;
  const messages = gitMessages.concat(dropboxMessages);

  return (
    <Lightbox
      className="progress-log"
      header={`${finished ? '✔️ Update done' : '⏳ Updating...'} ${isGit ? ` - "${repo}/${branch}"` : ''}`}
      confirm={finished ? confirm : null}
    >
      <ul className="progress-log__messages">
        {messages.map(({ message, timestamp }, index) => (
          message === '.' ? null : (
            <li
              key={index}
              className="progress-log__message"
              title={dayjs.unix(timestamp).format('HH:mm:ss')}
            >
              {message}
            </li>
          )
        ))}
      </ul>
      <div className="progress-log__duration">
        {`Started at: ${dayjs.unix(timeStart).format('HH:mm:ss')}`}
        <br />
        {`${finished ? 'Finished after' : 'Running for'}: ${dayjs.duration(timeLatest - timeStart, 'seconds').format('HH:mm:ss')}`}
        {isGit ? (
          <>
            <br />
            {'Repository: '}
            <a
              title={repoUrl}
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open GitHub
            </a>
          </>
        ) : null}
        {isDropbox ? (
          <>
            <br />
            <a
              title="Open Dropbox folder"
              href="https://www.dropbox.com/home/Apps/GameBoyPrinter"
              target="_blank"
              rel="noreferrer"
            >
              Open Dropbox folder
            </a>
          </>
        ) : null}
      </div>
    </Lightbox>
  );
};

ProgressLogBox.propTypes = {
  git: PropTypes.shape({
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
      }),
    ).isRequired,
    repoUrl: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired,
    branch: PropTypes.string.isRequired,
  }).isRequired,
  dropbox: PropTypes.shape({
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  confirm: PropTypes.func.isRequired,
};

export default ProgressLogBox;
