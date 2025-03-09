import type { Theme } from '@mui/material';
import { generateTheme } from './tools/generateTheme';

export const darkTheme: Theme = generateTheme('dark', '#b3acbe', '#455c63', '#4a6959', '#2a292b', '#b2b2b2');
export const lightTheme: Theme = generateTheme('light', '#292037', '#283539', '#273931', '#d6d3dc', '#333333');
