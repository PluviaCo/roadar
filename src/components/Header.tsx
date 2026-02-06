import { AppBar, Box, Button, Toolbar, css, styled } from '@mui/material'
import { CustomLink } from './CustomLink'

const StyledCustomLink = styled(CustomLink)(
  ({ theme }) => css`
    color: ${theme.palette.common.white};
  `,
)

export function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <StyledCustomLink to="/">Index</StyledCustomLink>
          <StyledCustomLink to="/about">About</StyledCustomLink>
          <StyledCustomLink to="/settings">Settings</StyledCustomLink>
          <StyledCustomLink to="/login">Login</StyledCustomLink>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
