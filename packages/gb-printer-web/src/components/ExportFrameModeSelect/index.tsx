import { MenuItem, TextField } from '@mui/material';
import  { type ExportFrameMode } from 'gb-image-decoder';
import { useTranslations } from 'next-intl';
import exportFrameModes from '@/consts/exportFrameModes';


interface Props {
  frameMode: ExportFrameMode;
  onFrameModeChange: (frameMode: ExportFrameMode) => void;
  label: string;
}

function ExportFrameModeSelect({ label, frameMode, onFrameModeChange }: Props) {
  const t = useTranslations('ExportFrameModeSelect');

  return (
    <TextField
      value={frameMode}
      label={label}
      select
      onChange={(ev) => {
        onFrameModeChange(ev.target.value as ExportFrameMode);
      }}
    >
      {exportFrameModes.map(({ id, name }) => (
        <MenuItem key={id} value={id}>{t(name)}</MenuItem>
      ))}
    </TextField>
  );
}

export default ExportFrameModeSelect;
