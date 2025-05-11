'use client';
import {createTheme} from '@mui/material/styles';
import { purple, teal } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: teal[200],
        },
      error: {
        main: '#B00020',
      }
    },
    typography: {
        fontFamily: 'var(--font-roboto)',
    },
});

export default theme;