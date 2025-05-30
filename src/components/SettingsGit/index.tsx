'use client';

import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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
        label="Use github as storage"
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
            label="Owner"
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
            label="Repository name"
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
            label="Branch"
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
            label="Throttle (in ms)"
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
            label="Token"
            helperText={(
              <>
                {'Go to GitHub to create a '}
                <Link
                  href="https://github.com/settings/personal-access-tokens/new"
                  target="_blank"
                  rel="noreferrer"
                >
                  new fine-grained personal access token
                </Link>
                {', select the repository you want to use for synching and allow read/write for '}
                <Typography
                  component="code"
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    padding: '0 2px',
                  }}
                >
                  &quot;Repository Permissions &gt; Contents&quot;
                </Typography>
              </>
            )}
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
