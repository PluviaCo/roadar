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
  },
})