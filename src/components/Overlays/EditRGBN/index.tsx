import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslations } from 'next-intl';
import React from 'react';
import ImageRender from '@/components/ImageRender';
import Lightbox from '@/components/Lightbox';
import RGBNSelect from '@/components/RGBNSelect';
import { defaultRGBNPalette } from '@/consts/defaults';
import { RGBGrouping, useEditRGBNImages } from '@/hooks/useEditRGBNImages';
import { getChannelColor } from '@/tools/getChannelColor';
import type { RGBNHashes } from '@/types/Image';

function previewPalette(isR: boolean, isG: boolean, isB: boolean, isN: boolean): string[] {
  const rPart = isR ? 255 : 0;
  const gPart = isG ? 255 : 0;
  const bPart = isB ? 255 : 0;

  const color = (r: number, g: number, b: number, intensity: number) => {
    const toIntensity = (v: number, i: number): string => (
      Math.floor(v * i).toString(16).padStart(2, '0')
    );

    return (
      `#${toIntensity(r, intensity)}${toIntensity(g, intensity)}${toIntensity(b, intensity)}`
    );
  };

  if (isR || isG || isB) {
    return [
      color(rPart, gPart, bPart, 1),
      color(rPart, gPart, bPart, 0.66),
      color(rPart, gPart, bPart, 0.33),
      '#000000',
    ];
  }

  if (isN) {
    return ['#ffffff', '#aaaaaa', '#555555', '#000000'];
  }

  return ['#b2b2b2', '#949494', '#737373', '#606060'];

}

function EditRGBN() {
  const t = useTranslations('EditRGBN');
  const {
    canConfirm,
    order,
    grouping,
    lengthWarning,
    rgbnHashes,
    sortedImages,
    createGroup,
    updateOrder,
    toggleSingleChannel,
    setGrouping,
    setCreateGroup,
    save,
    cancelEditRGBNImages,
  } = useEditRGBNImages();

  const theme = useTheme();
  const aboveSm = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Lightbox
      confirm={save}
      deny={cancelEditRGBNImages}
      closeOnOverlayClick={false}
      canConfirm={canConfirm && !lengthWarning}
      header={t('dialogHeader')}
      contentWidth="576px"
    >
      <Stack
        direction="column"
        gap={4}
      >
        <TextField
          label={t('groupingLabel')}
          select
          size="small"
          value={grouping}
          onChange={(ev) => setGrouping(ev.target.value as RGBGrouping)}
        >
          <MenuItem value={RGBGrouping.BY_COLOR}>
            {t('groupByColor')}
          </MenuItem>
          <MenuItem value={RGBGrouping.BY_IMAGE}>
            {t('groupByImage')}
          </MenuItem>
          <MenuItem value={RGBGrouping.MANUAL}>
            {t('manualChannelSelection')}
          </MenuItem>
        </TextField>

        { grouping === RGBGrouping.MANUAL ? (
          <Stack
            direction="column"
            gap={1}
          >
            <Typography variant="body2">
              {t('manualChannelInstructions')}
            </Typography>
            <Stack
              direction="row"
              gap={2}
              component="ul"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              sx={{
                '& .MuiCardContent-root': {
                  padding: 1,
                },
              }}
            >
              { sortedImages.map(({ hash }) => {
                const isR = rgbnHashes[0]?.r === hash;
                const isG = rgbnHashes[0]?.g === hash;
                const isB = rgbnHashes[0]?.b === hash;
                const isN = rgbnHashes[0]?.n === hash;
                const palette = previewPalette(isR, isG, isB, isN);

                return (
                  <Card
                    key={hash}
                    className="edit-rgbn__single-image-list-entry"
                    // elevation={8}
                    variant="outlined"
                  >
                    <CardContent
                      sx={{
                        '.gameboy-image': {
                          width: '80px',
                          margin: '0 auto',
                          imageRendering: 'auto',
                        },
                      }}
                    >
                      <ImageRender
                        lockFrame={false}
                        invertPalette={false}
                        invertFramePalette={false}
                        palette={palette}
                        framePalette={palette}
                        hash={hash}
                      />
                    </CardContent>
                    <CardActions>
                      <RGBNSelect
                        isR={isR}
                        isG={isG}
                        isB={isB}
                        isN={isN}
                        toggleChannel={(channel: keyof RGBNHashes) => toggleSingleChannel(channel, hash)}
                      />
                    </CardActions>
                  </Card>
                );
              }) }
            </Stack>
          </Stack>
        ) : (
          <Stack
            direction="column"
            gap={1}
          >
            <Typography variant="body2">
              {t('channelOrderInstructions')}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              gap={{ xs: 1, sm: 2 }}
              component="ul"
              justifyContent="center"
              alignItems="center"
            >
              { order.map((colorKey, index) => (colorKey === 's' ? (
                <Divider
                  key={colorKey}
                  orientation={aboveSm ? 'vertical' : 'horizontal'}
                  variant="middle"
                  flexItem
                />
              ) : (
                <ButtonGroup
                  key={colorKey}
                  component="li"
                  size="small"
                  sx={{
                    backgroundColor: getChannelColor(colorKey),
                  }}
                >
                  <IconButton
                    onClick={() => updateOrder(colorKey, index - 1)}
                    sx={{ svg: { color: '#ffffff' } }}
                  >
                    {aboveSm ? <KeyboardArrowLeftIcon /> : <KeyboardArrowUpIcon />}
                  </IconButton>
                  <IconButton
                    onClick={() => updateOrder(colorKey, index + 1)}
                    sx={{ svg: { color: '#ffffff' } }}
                  >
                    {aboveSm ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </ButtonGroup>
              )))}
            </Stack>

            { lengthWarning ? (
              <Alert
                variant="filled"
                severity="error"
              >
                {t('channelDistributionError')}
              </Alert>
            ) : null }

          </Stack>
        ) }

        <Stack
          direction="column"
          gap={1}
        >
          <Typography variant="body2">
            {t('imagePreview')}
          </Typography>
          <Stack
            direction="row"
            component="ul"
            sx={{
              overflowX: 'auto',
              '& > *': {
                flex: '160px 0 0',
                margin: '0 auto',
              },
            }}
            gap={1}
          >
            { rgbnHashes.map((hashes, index) => (
              <Box
                key={index}
                component="li"
              >
                <ImageRender
                  lockFrame={false}
                  invertPalette={false}
                  invertFramePalette={false}
                  palette={defaultRGBNPalette}
                  framePalette={[]}
                  hash="newRGBN"
                  hashes={hashes}
                />
              </Box>
            ))}
          </Stack>
        </Stack>

        <FormControlLabel
          label={t('createGroupLabel')}
          control={(
            <Switch
              checked={createGroup}
              onChange={({ target }) => {
                setCreateGroup(target.checked);
              }}
            />
          )}
        />
      </Stack>
    </Lightbox>
  );
}

export default EditRGBN;
