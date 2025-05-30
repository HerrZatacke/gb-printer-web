import GitHubIcon from '@mui/icons-material/GitHub';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { useMemo, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import { useProgressLog } from '@/hooks/useProgressLog';
import type { LogItem } from '@/stores/interactionsStore';

dayjs.extend(duration);

const MESSAGES_CUTOFF = 15;

function ProgressLogBox() {

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
  } = useProgressLog();

  const [cutOffMessages, setCutOffMessages] = useState(true);

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

  const messages = useMemo<LogItem[]>(() => (
    [
      ...gitMessages,
      ...dropboxMessages,
    ]
      .filter(({ message }) => (message !== '.'))
  ), [dropboxMessages, gitMessages]);

  const shownMessages = useMemo<LogItem[]>(() => (
    messages.filter((_, index) => (
      cutOffMessages ? index < MESSAGES_CUTOFF : true
    ))
  ), [cutOffMessages, messages]);

  if (
    !gitMessages.length &&
    !dropboxMessages.length

  ) {
    return null;
  }

  return (
    <Lightbox
      header={`${finished ? '✔️ Update done' : '⏳ Updating...'} ${isGit ? ` - "${repo}/${branch}"` : ''}`}
      confirm={finished ? confirm : undefined}
    >
      <Stack
        direction="column"
        gap={2}
      >
        <Box
          component="ul"
          sx={{
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: '30vh',
            '& > .MuiTypography-root': {
              whiteSpace: 'nowrap',
            },
          }}
        >
          {shownMessages.map(({ message, timestamp }, index) => (
            <Typography
              key={index}
              variant="caption"
              component="li"
              title={dayjs.unix(timestamp).format('HH:mm:ss')}
            >
              {message}
            </Typography>
          ))}
        </Box>

        {messages.length > MESSAGES_CUTOFF && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setCutOffMessages(!cutOffMessages)}
            endIcon={cutOffMessages ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          >
            {
              cutOffMessages ?
                `Show all ${messages.length} messages` :
                'Reduce messages'
            }
          </Button>
        )}
        <Stack
          direction="column"
          gap={0}
        >
          <Typography variant="caption">
            {`Started at: ${dayjs.unix(timeStart).format('HH:mm:ss')}`}
          </Typography>
          <Typography variant="caption">
            {`${finished ? 'Finished after' : 'Running for'}: ${dayjs.duration(timeLatest - timeStart, 'seconds').format('HH:mm:ss')}`}
          </Typography>
        </Stack>
        {isGit && (
          <Button
            variant="outlined"
            component="a"
            color="secondary"
            startIcon={<GitHubIcon />}
            title={repoUrl}
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open GitHub Repository
          </Button>
        )}
        {isDropbox && (
          <Button
            variant="outlined"
            component="a"
            color="secondary"
            title={`Open Dropbox folder:\nhttps://www.dropbox.com/home/Apps/GameBoyPrinter/${dropboxPath}`}
            href={`https://www.dropbox.com/home/Apps/GameBoyPrinter/${dropboxPath}`}
            target="_blank"
            rel="noreferrer"
          >
            Open Dropbox folder
          </Button>
        )}
      </Stack>
    </Lightbox>
  );
}

export default ProgressLogBox;
