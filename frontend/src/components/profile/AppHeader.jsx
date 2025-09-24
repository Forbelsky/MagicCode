// AppHeader: top navigation bar with a sidebar toggle and a simple account menu.
// Keeping styles in a small object to avoid cluttering JSX with long sx expressions.
import { useState } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Tooltip, Button, Avatar, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { MenuIcon, ExpandMoreIcon, PersonOutlineIcon, NotificationsNoneIcon, SettingsOutlinedIcon, LogoutIcon } from './icons'
import { useUserContext } from '../../app/UserProvider.jsx'

const styles = {
  appBar: {
    zIndex: (t) => t.zIndex.drawer + 1, // ensures AppBar stays above the Drawer
    backgroundColor: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(8px)',
    color: 'text.primary',
  },
  title: { flexGrow: 1, fontWeight: 700 },
  accountBtn: { textTransform: 'none' },
  avatar: { width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' },
}

export default function AppHeader({ onToggleSidebar }) {
  // MUI Menu control (anchor element indicates open/close)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const openMenu = (e) => setMenuAnchor(e.currentTarget)
  const closeMenu = () => setMenuAnchor(null)

  // Aktuální uživatel z kontextu pro zobrazení v headeru
  const { user, logout } = useUserContext()
  const displayName = user?.username || 'Guest'
  const initials = (user?.username || 'Guest')
    .split(' ')
    .map((s) => s?.[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <AppBar position="fixed" elevation={1} sx={styles.appBar}>
      <Toolbar sx={{ gap: 1 }}>
        {/* Collapses/expands the left Drawer */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleSidebar}
          disableRipple
          disableFocusRipple
          sx={{ '&:focus,&:focus-visible': { outline: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Brand/title */}
        <Typography variant="h6" sx={styles.title}>EduNotes</Typography>

        {/* Account chip -> opens menu */}
        <Tooltip title="Account">
          <Button
            color="inherit"
            onClick={openMenu}
            endIcon={<ExpandMoreIcon sx={{ transition: 'transform .15s', transform: menuAnchor ? 'rotate(180deg)' : 'none' }} />}
            disableRipple
            disableFocusRipple
            sx={[styles.accountBtn, { '&:focus,&:focus-visible': { outline: 'none' } }]}
          >
            <Avatar sx={styles.avatar}>{initials}</Avatar>
            {displayName}
          </Button>
        </Tooltip>

        {/* Simple account menu with links/actions */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu} elevation={2}>
          <MenuItem onClick={closeMenu} disableRipple sx={{ '&:focus,&:focus-visible': { outline: 'none' } }}>
            <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Profile Settings" />
          </MenuItem>
          <MenuItem onClick={closeMenu} disableRipple sx={{ '&:focus,&:focus-visible': { outline: 'none' } }}>
            <ListItemIcon><NotificationsNoneIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Notifications" />
          </MenuItem>
          <MenuItem onClick={closeMenu} disableRipple sx={{ '&:focus,&:focus-visible': { outline: 'none' } }}>
            <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
          <MenuItem onClick={() => { closeMenu(); logout(); }} disableRipple sx={{ '&:focus,&:focus-visible': { outline: 'none' } }}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Sign Out" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
