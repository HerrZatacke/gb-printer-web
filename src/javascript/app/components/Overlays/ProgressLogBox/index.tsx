import React, { useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Lightbox from '../../Lightbox';

import './index.scss';
import { useProgress } from './useProgress';

dayjs.extend(duration);

const messagesCutOff = 15;

const ProgressLogBox = () => {

  const {
    git: {
      messages: gitMessages,
      repoUrl,
      repo,
      branch,
    },
    dropbox: {
      messages: dropboxMessages,
      path: dropboxPath,
    },
    confirm,
  } = useProgress();

  const [cutOffMessages, setCutOffMessages] = useState(true);

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

  const shownMessages = messages.filter((_, index) => (
    cutOffMessages ? index < messagesCutOff : true
  ));

  return (
    <Lightbox
      className="progress-log"
      header={`${finished ? '✔️ Update done' : '⏳ Updating...'} ${isGit ? ` - "${repo}/${branch}"` : ''}`}
      confirm={finished ? confirm : undefined}
    >
      <ul className="progress-log__messages">
        {shownMessages.map(({ message, timestamp }, index) => (
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
      {messages.length > messagesCutOff ? (
        <button
          type="button"
          className="progress-log__button"
          onClick={() => setCutOffMessages(!cutOffMessages)}
        >
          {
            cutOffMessages ?
              `Show all ${messages.length} messages` :
              'Reduce messages'
          }
        </button>
      ) : null}
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
              title={`Open Dropbox folder:\nhttps://www.dropbox.com/home/Apps/GameBoyPrinter/${dropboxPath}`}
              href={`https://www.dropbox.com/home/Apps/GameBoyPrinter/${dropboxPath}`}
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

export default ProgressLogBox;
