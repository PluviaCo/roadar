import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  css,
  styled,
} from '@mui/material'
import { Link, useMatchRoute, useRouteContext } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CustomLink } from './CustomLink'
import { RouteSearchBar } from './RouteSearchBar'
import Logo from '@/assets/logo.svg'
import { fetchRoutes } from '@/server/routes'

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
  const [routes, setRoutes] = useState<Array<any>>([])
  const matchRoute = useMatchRoute()

  // Only show search if not on home page
  const isHome = matchRoute({ to: '/' })

  useEffect(() => {
    if (routes.length === 0) {
      fetchRoutes().then(setRoutes)
    }
  }, [routes.length])

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
          {/* Search bar, only show if not on home page */}
          <Box sx={{ display: 'flex', flexGrow: 1, minWidth: 0, mx: 2 }}>
            {!isHome && (
              <RouteSearchBar
                routes={routes}
                sx={{
                  flexGrow: 1,
                  width: '100%',
                  minWidth: 0,
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid',
                    borderColor: 'grey.300',
                    backgroundColor: 'white',
                    height: 44,
                    // '& fieldset': {
                    //   border: 'none',
                    // },
                  },
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              minWidth: 0,
            }}
          >
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
                    src={user.picture_url}
                    alt={user.name}
                    sx={{ width: 32, height: 32 }}
                  >
                    {user.picture_url ? undefined : user.name.charAt(0)}
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
                  <MenuItem disabled>
                    <Typography variant="body1">{user.name}</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    component={Link}
                    to="/settings"
                  >
                    Settings
                  </MenuItem>
                  <MenuItem to="/signout" component={Link}>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <StyledCustomLink to="/signin">Sign In</StyledCustomLink>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
