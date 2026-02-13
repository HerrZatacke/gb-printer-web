import RefreshIcon from '@mui/icons-material/Refresh';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import SheetsTableRow from '@/components/SettingsGapiSheets/SheetsTableRow';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';
import useGapiSync from '@/contexts/GapiSyncContext';
import { SheetStats } from '@/hooks/useGapiSheetsStats';
import { useStoragesStore } from '@/stores/stores';

interface Props {
  sheetsStats: SheetStats[];
}

function SheetsTable({ sheetsStats }: Props) {
  const { updateSheets } = useGapiSheetState();
  const { gapiStorage } = useStoragesStore();
  const { busy } = useGapiSync();
  const t = useTranslations('SheetsTable');

  const disabled = busy || !gapiStorage.sheetId || !gapiStorage.use;

  return (
    <TableContainer
      component={Paper}
      sx={(theme) => ({
        '--color-match-same': `rgb(from ${theme.palette.success.main} r g b / 0.25)`,
        '--color-match-diff': `rgb(from ${theme.palette.error.main} r g b / 0.25)`,
      })}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">{t('id')}</TableCell>
            <TableCell align="right">{t('title')}</TableCell>
            <TableCell align="right">{t('columns')}</TableCell>
            <TableCell align="right">{t('rows')}</TableCell>
            <TableCell align="right">{t('lastRemoteUpdate')}</TableCell>
            <TableCell />
            <TableCell align="left">{t('lastLocalUpdate')}</TableCell>
            <TableCell align="right">
              <IconButton
                disabled={disabled}
                title={t('refreshStats')}
                onClick={updateSheets}
              >
                <RefreshIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sheetsStats.map((sheetStats) => (
            <SheetsTableRow
              key={sheetStats.sheetName}
              sheetStats={sheetStats}
              disabled={disabled}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default memo(SheetsTable);
