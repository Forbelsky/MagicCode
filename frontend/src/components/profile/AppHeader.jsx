import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  MenuIcon,
  ExpandMoreIcon,
  PersonOutlineIcon,
  NotificationsNoneIcon,
  SettingsOutlinedIcon,
  LogoutIcon,
} from './icons'
import { useUserContext } from '../../app/UserProvider.jsx'
import { useNavigate } from 'react-router-dom'


/** ---- Stylové konstanty ---- */
const sxStyles = {
  appBar: {
    zIndex: (t) => t.zIndex.drawer + 1,
    backgroundColor: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(8px)',
    color: 'text.primary',
  },
  title: { flexGrow: 1, fontWeight: 700 },
  accountBtn: { textTransform: 'none', '&:focus,&:focus-visible': { outline: 'none' } },
  avatar: { width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' },
  iconBtn: { '&:focus,&:focus-visible': { outline: 'none' } },
}

/** ---- Pomocné funkce ---- */
function getInitials(username = 'Guest') {
  return username
    .split(' ')
    .map((s) => s?.[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** ---- Komponenta ---- */
export default function AppHeader({ onToggleSidebar }) {
  const { user, logout } = useUserContext()
  const displayName = user?.username || 'Guest'
  const initials = getInitials(user?.username)
  const navigate = useNavigate()
  const [menuAnchor, setMenuAnchor] = useState(null)
  const menuOpen = Boolean(menuAnchor)
  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget)
  const handleMenuClose = () => setMenuAnchor(null)

  const handleLogout = () => {
    handleMenuClose()
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="fixed" elevation={1} sx={sxStyles.appBar}>
      <Toolbar sx={{ gap: 1 }}>
        {/* Sidebar toggle */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleSidebar}
          disableRipple
          sx={sxStyles.iconBtn}
        >
          <MenuIcon />
        </IconButton>

        {/* Brand */}
        <Typography variant="h6" sx={sxStyles.title}>
          EduNotes
        </Typography>

        {/* Account menu trigger */}
        <Tooltip title="Účet">
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transition: 'transform .15s',
                  transform: menuOpen ? 'rotate(180deg)' : 'none',
                }}
              />
            }
            disableRipple
            sx={sxStyles.accountBtn}
          >
            <Avatar sx={sxStyles.avatar}>{initials}</Avatar>
            {displayName}
          </Button>
        </Tooltip>

        {/* Account menu */}
        <Menu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={handleMenuClose}
          elevation={2}
        >
          <MenuItem onClick={handleMenuClose} disableRipple>
            <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Profil" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose} disableRipple>
            <ListItemIcon><NotificationsNoneIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Notifikace" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose} disableRipple>
            <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Nastavení" />
          </MenuItem>
          <MenuItem onClick={handleLogout} disableRipple>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Odhlásit se" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
