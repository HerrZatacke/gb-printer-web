import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import JoinFullIcon from '@mui/icons-material/JoinFullRounded';
import {
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import useGapiSync from '@/contexts/GapiSyncContext';
import { SheetStats } from '@/hooks/useGapiSheetsStats';

const toDate = (timestamp?: number): string => {
  if (!timestamp) {
    return 'N/A';
  }

  return (new Date(timestamp)).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const getSign = (value: number): string => {
  switch (value) {
    case -1:
      return '<';
    case 1:
      return '>';
    default:
      return '=';
  }
};


interface Props {
  sheetStats: SheetStats;
  disabled: boolean;
}

function SheetsTableRow({ sheetStats, disabled }: Props) {
  const { performPush, performPull, performMerge } = useGapiSync();
  const t = useTranslations('SheetsTable');
  const {
    sheetName,
    sheetId,
    columnCount,
    rowCount,
    remoteTimestamp,
    localTimestamp,
    diff,
    sort,
    Icon,
  } = sheetStats;

  return (
    <TableRow
      key={sheetName}
      sx={{
        '--color-match': diff ? 'var(--color-match-diff)' : 'var(--color-match-same)',
      }}
    >
      <TableCell align="right">{sheetId}</TableCell>
      <TableCell align="right">
        <Stack direction="row" gap={1} alignItems="center" justifyContent="right">
          <span>{sheetName}</span>
          {Icon && <Icon />}
        </Stack>
      </TableCell>
      <TableCell align="right">{columnCount}</TableCell>
      <TableCell align="right">{rowCount}</TableCell>
      <TableCell align="right" sx={{ backgroundColor: 'var(--color-match)' }}>{toDate(remoteTimestamp)}</TableCell>
      <TableCell align="center" sx={{ backgroundColor: 'var(--color-match)' }}>
        <Typography variant="h4">
          {diff > 0 && '✨ '}
          {diff < 0 && '🕰️ '}
          {getSign(diff)}
          {diff > 0 && ' 🕰️'}
          {diff < 0 && ' ✨'}
        </Typography>
      </TableCell>
      <TableCell align="left" sx={{ backgroundColor: 'var(--color-match)' }}>{toDate(localTimestamp)}</TableCell>
      <TableCell align="right">
        <IconButton
          disabled={disabled}
          title={t('syncPush')}
          onClick={() => performPush({
            sheetName,
            newLastUpdateValue: localTimestamp,
            sort,
          })}
        >
          <CloudUploadIcon />
        </IconButton>
        <IconButton
          disabled={disabled}
          title={t('syncMerge')}
          onClick={() => performMerge({
            sheetName,
            lastRemoteUpdate: remoteTimestamp,
            lastLocalUpdate: localTimestamp,
            sort,
          })}
        >
          <JoinFullIcon />
        </IconButton>
        <IconButton
          disabled={disabled}
          title={t('syncPull')}
          onClick={() => performPull({
            merge: false,
            sheetName,
            lastRemoteUpdate: remoteTimestamp,
          })}
        >
          <CloudDownloadIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}


export default SheetsTableRow;
