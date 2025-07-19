'use client';

import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import { textFieldSlotDefaults } from '@/consts/textFieldSlotDefaults';
import { useAsPasswordField } from '@/hooks/useAsPasswordField';
import useStoragesStore from '@/stores/storagesStore';
import type { GitStorageSettings } from '@/types/Sync';

function SettingsGit() {
  const { gitStorage, setGitStorage } = useStoragesStore();

  const [use, setUse] = useState<boolean>(gitStorage.use || false);
  const [owner, setOwner] = useState<string>(gitStorage.owner || '');
  const [repo, setRepo] = useState<string>(gitStorage.repo || '');
  const [branch, setBranch] = useState<string>(gitStorage.branch || '');
  const [throttle, setThrottle] = useState<string>(gitStorage.throttle?.toString(10) || '10');
  const [token, setToken] = useState<string>(gitStorage.token || '');
  const { type, button } = useAsPasswordField();
  const t = useTranslations('SettingsGit');

  const updateGitStorage = useCallback((partial: Partial<GitStorageSettings>) => {
    setGitStorage({
      ...gitStorage,
      ...partial,
    });
  }, [gitStorage, setGitStorage]);

  return (
    <Stack
      direction="column"
      gap={6}
    >
      <FormControlLabel
        label={t('enableStorage')}
        control={(
          <Switch
            checked={use}
            onChange={({ target }) => {
              setUse(target.checked);
              updateGitStorage({ use: target.checked });
            }}
          />
        )}
      />

      { !use ? null : (
        <>
          <TextField
            id="settings-git-owner"
            label={t('owner')}
            type="text"
            value={owner}
            onChange={(ev) => {
              setOwner(ev.target.value);
            }}
            onBlur={() => {
              updateGitStorage({ owner });
            }}
          />

          <TextField
            id="settings-git-repo"
            label={t('repoName')}
            type="text"
            value={repo}
            onChange={(ev) => {
              setRepo(ev.target.value);
            }}
            onBlur={() => {
              updateGitStorage({ repo });
            }}
          />

          <TextField
            id="settings-git-branch"
            label={t('branch')}
            type="text"
            value={branch}
            onChange={(ev) => {
              setBranch(ev.target.value);
            }}
            onBlur={() => {
              updateGitStorage({ branch });
            }}
          />

          <TextField
            id="settings-git-throttle"
            label={t('throttle')}
            type="text"
            value={throttle}
            onChange={(ev) => {
              setThrottle(ev.target.value);
            }}
            onBlur={() => {
              const parsed = Math.min(10, Math.max(5000, parseInt(throttle, 10)));
              setThrottle(parsed.toString(10));
              updateGitStorage({
                throttle: parsed,
              });
            }}
          />


          <TextField
            id="settings-git-token"
            label={t('token')}
            helperText={t.rich('tokenHelper', {
              link: (chunks) => (
                <Link
                  href="https://github.com/settings/personal-access-tokens/new"
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </Link>
              ),
              code: (chunks) => (
                <Typography
                  component="code"
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    padding: '0 2px',
                  }}
                >
                  {chunks}
                </Typography>
              ),
            })}
            type={type}
            value={token}
            slotProps={{
              input: {
                endAdornment: button,
              },
              ...textFieldSlotDefaults,
            }}
            onChange={(ev) => {
              setToken(ev.target.value);
            }}
            onBlur={() => {
              updateGitStorage({ token });
            }}
          />
        </>
      )}
    </Stack>
  );
}

export default SettingsGit;
