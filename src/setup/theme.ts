import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF',
      light: '#66B2FF',
      dark: '#0056B3',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: "'Roboto Variable', sans-serif",
    h1: {
      fontSize: '3rem', // 48px
      fontWeight: 400, // regular - elegant for large text
    },
    h2: {
      fontSize: '2.25rem', // 36px - better proportion from h1
      fontWeight: 400, // regular
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 500, // medium - more emphasis
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 500, // medium
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: 500, // medium
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: 600, // semibold - needs weight since smallest
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: '#000',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
})
