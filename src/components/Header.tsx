import { AppBar, Box, Toolbar, css, styled } from '@mui/material'
import { useRouteContext } from '@tanstack/react-router'
import { CustomLink } from './CustomLink'
import { CustomButtonLink } from './CustomButtonLink'

const StyledCustomLink = styled(CustomLink)(
  ({ theme }) => css`
    color: ${theme.palette.common.white};
  `,
)

export function Header() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <StyledCustomLink to="/">Index</StyledCustomLink>
          <StyledCustomLink to="/about">About</StyledCustomLink>
          <StyledCustomLink to="/settings">Settings</StyledCustomLink>
          {user ? (
            <p>
              {user.email}
              <StyledCustomLink to="/signout">Sign Out</StyledCustomLink>
            </p>
          ) : (
            <StyledCustomLink to="/signin">Sign In</StyledCustomLink>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
