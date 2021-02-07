import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Lightbox from '../Lightbox';

dayjs.extend(duration);

const GitLogBox = ({ messages, confirm }) => {
  if (!messages.length) {
    return null;
  }

  const { timestamp: timeStart } = messages[messages.length - 1];
  const { timestamp: timeLatest, message: latestMessage } = messages[0];

  return (
    <Lightbox
      className="git-log"
      header="Update Progress"
      confirm={latestMessage === '.' ? confirm : null}
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
        {`started: ${dayjs.unix(timeStart).format('HH:mm:ss')}`}
        <br />
        {`running: ${dayjs.duration(timeLatest - timeStart, 'seconds').format('HH:mm:ss')}`}
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
};

export default GitLogBox;
