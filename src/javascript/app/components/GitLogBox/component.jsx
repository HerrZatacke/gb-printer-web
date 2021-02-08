import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Lightbox from '../Lightbox';

dayjs.extend(duration);

const GitLogBox = ({ messages, confirm, repoUrl, repo, branch }) => {
  if (!messages.length) {
    return null;
  }

  const { timestamp: timeStart } = messages[messages.length - 1];
  const { timestamp: timeLatest, message: latestMessage } = messages[0];

  const finished = latestMessage === '.';

  return (
    <Lightbox
      className="git-log"
      header={`${finished ? '✔️ Update done -' : '⏳ Updating...'} "${repo}/${branch}"`}
      confirm={finished ? confirm : null}
    >
      <ul className="git-log__messages">
        {messages.map(({ message, timestamp }, index) => (
          message === '.' ? null : (
            <li
              key={index}
              className="git-log__message"
              title={dayjs.unix(timestamp).format('HH:mm:ss')}
            >
              {message}
            </li>
          )
        ))}
      </ul>
      <div className="git-log__duration">
        {`Started at: ${dayjs.unix(timeStart).format('HH:mm:ss')}`}
        <br />
        {`${finished ? 'Finished after' : 'Running for'}: ${dayjs.duration(timeLatest - timeStart, 'seconds').format('HH:mm:ss')}`}
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
      </div>
    </Lightbox>
  );
};

GitLogBox.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
    }),
  ).isRequired,
  confirm: PropTypes.func.isRequired,
  repoUrl: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
};

export default GitLogBox;
