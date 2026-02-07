import {
  AppBar,
  Avatar,
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
    color: ${theme.palette.text.primary};
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
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2 }}>
          <StyledCustomLink to="/">
            <img src={Logo} alt="Roadar" width="24" height="24" />
          </StyledCustomLink>
          <StyledCustomLink to="/routes">Routes</StyledCustomLink>
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <>
              <StyledCustomLink to="/saved">Saved</StyledCustomLink>
              <StyledCustomLink to="/routes/my">My Routes</StyledCustomLink>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  src={user.picture_url || undefined}
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                >
                  {!user.picture_url && <UserIcon />}
                </Avatar>
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
                <MenuItem disabled>{user.name}</MenuItem>
                <Link to="/settings">
                  <MenuItem onClick={handleClose}>Settings</MenuItem>
                </Link>
                <Link to="/signout">
                  <MenuItem>Sign Out</MenuItem>
                </Link>
              </Menu>
            </>
          ) : (
            <StyledCustomLink to="/signin">Sign In</StyledCustomLink>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
