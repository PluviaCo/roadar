import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  css,
  styled,
} from '@mui/material'
import { Link, useRouteContext } from '@tanstack/react-router'
import { useState } from 'react'
import UserIcon from '@mui/icons-material/Person'
import { CustomLink } from './CustomLink'
import Logo from '@/assets/logo.svg'

const StyledCustomLink = styled(CustomLink)(
  ({ theme }) => css`
    color: ${theme.palette.common.white};
    text-decoration: none;
    display: flex;
    align-items: center;
  `,
)

export function Header() {
  const { user } = useRouteContext({ from: '__root__' })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <StyledCustomLink to="/">
            <img src={Logo} alt="Roadar" width="24" height="24" />
          </StyledCustomLink>
          <StyledCustomLink to="/routes">Routes</StyledCustomLink>
          <StyledCustomLink to="/settings">Settings</StyledCustomLink>
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <UserIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem disabled>{user.email}</MenuItem>
                <Link to="/settings">
                  <MenuItem>Sign Out</MenuItem>
                </Link>
              </Menu>
            </div>
          ) : (
            <StyledCustomLink to="/signin">Sign In</StyledCustomLink>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
