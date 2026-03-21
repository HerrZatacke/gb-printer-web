import DownloadIcon from '@mui/icons-material/Download';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { IconButton, Stack, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  audioSource: string;
  downloadFilename: string;
}

function AudioPlayer({ audioSource, downloadFilename }: Props) {

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [canPlay, setCanPlay] = useState(false);
  const [playing, setPlaying] = useState(false);

  const playerRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const audioNode = document.createElement('audio');
    playerRef.current = audioNode;

    audioNode.volume = 0.5;

    audioNode.addEventListener('emptied', () => setCanPlay(false));
    audioNode.addEventListener('canplay', () => setCanPlay(true));

    audioNode.addEventListener('playing', () => setPlaying(true));
    audioNode.addEventListener('pause', () => setPlaying(false));
    audioNode.addEventListener('ended', () => setPlaying(false));

    audioNode.addEventListener('loadedmetadata', () => setDuration(audioNode.duration));
    audioNode.addEventListener('timeupdate', () => setCurrentTime(audioNode.currentTime));
    audioNode.addEventListener('loadstart', () => {
      setDuration(0);
      setPlaying(false);
    });
  }, []);

  const progressText = useMemo(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    });

    return `${fmt.format(new Date(currentTime * 1000))} / ${fmt.format(new Date(duration * 1000))}`;
  }, [currentTime, duration]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    player.pause();
    player.src = audioSource;
    player.currentTime = 0;

    return () => {
      player.pause();
      player.src = '';
    };
  }, [audioSource]);

  const play = useCallback(() => {
    const player = playerRef.current;
    if (!player || !player.src || !player.seekable) {
      return;
    }

    player.currentTime = 0;
    player.play();
  }, [playerRef]);

  const stop = useCallback(() => {
    playerRef.current?.pause();
  }, [playerRef]);

  const download = useCallback(() => {
    saveAs(audioSource, downloadFilename);
    // https://sstv-decoder.mathieurenaud.fr/
  }, [audioSource, downloadFilename]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <IconButton
        onClick={playing ? stop : play}
        disabled={!canPlay}
      >
        {playing ? <StopCircleIcon fontSize="large" /> : <PlayCircleIcon fontSize="large" />}
      </IconButton>
      <Stack>
        <Typography variant="body1">{progressText}</Typography>
        <Typography variant="caption">{downloadFilename}</Typography>
      </Stack>
      <IconButton
        onClick={download}
        disabled={!canPlay}
      >
        <DownloadIcon fontSize="large" />
      </IconButton>
    </Stack>
  );
}

export default AudioPlayer;
