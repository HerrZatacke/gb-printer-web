import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useTranslations } from 'next-intl';
import React from 'react';
import type { ImageMetadata, RGBNHashes } from '@/types/Image';

export interface MetaProps {
  hash: string,
  hashes?: RGBNHashes,
  meta?: ImageMetadata,
}

interface TableRow {
  key: string,
  value: string,
}

function MetaTable({
  hash,
  hashes,
  meta,
}: MetaProps) {
  const t = useTranslations('MetaTable');
  const tableData: ImageMetadata & { hash: string } = {
    ...meta,
    hash,
  };

  const table = Object.keys(tableData)
    .reduce((acc: TableRow[], key): TableRow[] => {
      let value: string;

      // Possibly nested or boolean properties
      if (typeof tableData[key] !== 'number' && typeof tableData[key] !== 'string') {
        value = JSON.stringify(tableData[key]);
      } else {
        value = tableData[key] as string;
      }

      const row: TableRow = {
        key,
        value,
      };
      return [...acc, row];
    }, []);

  if (hashes) {
    const channelHashes = (Object.keys(hashes) as (keyof RGBNHashes)[])
      .reduce((acc: TableRow[], channel: keyof RGBNHashes): TableRow[] => {
        const row: TableRow = {
          key: t('hashChannel', { channel }),
          value: hashes[channel] as string,
        };
        return [...acc, row];
      }, []);
    table.push(...channelHashes);
  }


  return (
    <TableContainer>
      <Table
        padding="none"
        sx={{ fontFamily: 'monospace' }}
      >
        <TableBody>
          {table.map(({ key, value }) => (
            <TableRow key={key}>
              <TableCell component="th" scope="row">{key}</TableCell>
              <TableCell align="right">{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MetaTable;
