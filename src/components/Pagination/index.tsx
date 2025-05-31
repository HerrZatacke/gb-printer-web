import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import PaginationButton from '@/components/PaginationButton';

interface Props {
  page: number
  maxPageIndex: number,
}

function Pagination({ page, maxPageIndex }: Props) {
  const SKIP_STEP = 5;

  if (maxPageIndex === 0) {
    return null;
  }

  const buttons = [
    {
      icon: <KeyboardArrowLeftIcon />,
      pageIndex: page - 1,
      disabled: page < 1,
    },
    null,
    {
      icon: <KeyboardArrowRightIcon />,
      pageIndex: page + 1,
      disabled: maxPageIndex < page + 1,
    },
  ];

  if (maxPageIndex > SKIP_STEP) {
    buttons.unshift({
      icon: <KeyboardDoubleArrowLeftIcon />,
      pageIndex: page - SKIP_STEP,
      disabled: page < SKIP_STEP,
    });
    buttons.push({
      icon: <KeyboardDoubleArrowRightIcon />,
      pageIndex: page + SKIP_STEP,
      disabled: maxPageIndex < page + SKIP_STEP,
    });
  }

  if (maxPageIndex > 1) {
    buttons.unshift({
      icon: <FirstPageIcon />,
      pageIndex: 0,
      disabled: page === 0,
    });
    buttons.push({
      icon: <LastPageIcon />,
      pageIndex: maxPageIndex,
      disabled: page === maxPageIndex,
    });
  }

  return (
    <Stack
      direction="row"
      justifyContent="space-around"
    >
      <ButtonGroup
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        color="tertiary"
        variant="contained"
        disableElevation
        sx={{ '& .MuiButton-root': { width: 40, height: 40 } }}
      >
        {buttons.map((button) => {
          if (!button) {
            return (
              <Typography
                key="current"
                component="span"
                variant="body1"
                sx={{ px: 2, display: 'flex', alignItems: 'center' }}
              >
                { `${page + 1}/${maxPageIndex + 1}` }
              </Typography>
            );
          }

          const { icon, pageIndex, disabled } = button;
          return (
            <PaginationButton
              key={pageIndex}
              page={pageIndex}
              disabled={disabled}
            >
              {icon}
            </PaginationButton>
          );
        })}
      </ButtonGroup>
    </Stack>
  );
}

export default Pagination;
