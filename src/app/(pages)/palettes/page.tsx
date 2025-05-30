import Typography from '@mui/material/Typography';
import Palettes from '@/components/Palettes';

export default function PalettesPage() {
  return (
    <>
      <Typography
        component="h1"
        variant="h1"
      >
        Palettes
      </Typography>
      <Palettes />
    </>
  );
}
