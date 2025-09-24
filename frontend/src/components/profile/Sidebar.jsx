// Sidebar: permanent Drawer with subjects and their topics.
// Props:
// - collapsed: boolean controls compact/expanded width.
// - activeSubject/activeTopic: current selection.
// - setActiveSubject/setActiveTopic: callbacks to change selection.
import { Box, Drawer, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { CalculateOutlinedIcon, ScienceOutlinedIcon, HistoryEduOutlinedIcon, LanguageOutlinedIcon, AddCircleOutlineIcon, FolderOutlinedIcon, StarBorderOutlinedIcon, HistoryOutlinedIcon, MenuBookOutlinedIcon } from './icons'

const collapsedWidth = 80
const expandedWidth = 220

// Static sample data; later you can replace with API results
const subjectsData = [
  { id: 1, name: 'Mathematics', icon: <CalculateOutlinedIcon sx={{ color: 'inherit' }} />, topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics'] },
  { id: 2, name: 'Science',     icon: <ScienceOutlinedIcon sx={{ color: 'inherit' }} />,     topics: ['Biology', 'Chemistry', 'Physics', 'Earth Science'] },
  { id: 3, name: 'History',     icon: <HistoryEduOutlinedIcon sx={{ color: 'inherit' }} />,  topics: ['Ancient History', 'Medieval', 'Modern', 'World Wars'] },
  { id: 4, name: 'Languages',   icon: <LanguageOutlinedIcon sx={{ color: 'inherit' }} />,    topics: ['English', 'Spanish', 'French', 'German'] },
]

export default function Sidebar({ collapsed, activeSubject, setActiveSubject, activeTopic, setActiveTopic }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : expandedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedWidth : expandedWidth,
          boxSizing: 'border-box',
          backgroundColor: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      {/* Push content below AppBar */}
      <Toolbar />
      <Box sx={{ overflowY: 'auto', p: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', textAlign: collapsed ? 'center' : 'left', mb: 1 }}>
          {collapsed ? <MenuBookOutlinedIcon color="primary" fontSize="small" /> : 'Subjects'}
        </Typography>

        {/* Subjects list; expands to show topics for the active subject */}
        <List dense>
          {subjectsData.map((subject) => {
            const isActive = activeSubject === subject.name
            return (
              <Box key={subject.id} sx={{ mb: 1 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      // Selecting a subject also switches to its first topic
                      setActiveSubject(subject.name)
                      setActiveTopic(subject.topics[0])
                    }}
                    selected={isActive}
                    disableRipple
                    sx={{
                      borderLeft: isActive ? '4px solid #0ea5e9' : '4px solid transparent',
                      borderRadius: 1,
                      background: isActive ? 'linear-gradient(90deg, rgba(14,165,233,.10), rgba(124,58,237,.10))' : 'transparent',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      px: collapsed ? 1 : 2,
                      '&:focus,&:focus-visible': { outline: 'none' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, mr: collapsed ? 0 : 1, justifyContent: 'center' }}>
                      {subject.icon}
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary={subject.name} />}
                  </ListItemButton>
                </ListItem>

                {/* Topics for the active subject */}
                {isActive && !collapsed && (
                  <List dense sx={{ pl: 4 }}>
                    {subject.topics.map((topic) => (
                      <ListItem key={topic} disablePadding>
                        <ListItemButton
                          onClick={() => setActiveTopic(topic)}
                          selected={activeTopic === topic}
                          sx={{
                            borderRadius: 1,
                            '&.Mui-selected': { background: 'linear-gradient(90deg, rgba(219,234,254,1), rgba(237,233,254,1))' },
                          }}
                        >
                          <ListItemText primaryTypographyProps={{ fontSize: 13 }} primary={topic} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )
          })}

          {/* CTA for adding a new subject (visual only) */}
          {!collapsed && (
            <ListItem disablePadding sx={{ mt: 1 }}>
              <ListItemButton sx={{ borderRadius: 1, backgroundImage: 'linear-gradient(90deg,#0ea5e9,#7c3aed)', color: '#fff' }}>
                <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Add New Subject" />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        {/* Extra quick actions */}
        {!collapsed && (
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Quick Actions
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon><FolderOutlinedIcon /></ListItemIcon>
                  <ListItemText primary="All Notes" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon><StarBorderOutlinedIcon /></ListItemIcon>
                  <ListItemText primary="Favorites" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon><HistoryOutlinedIcon /></ListItemIcon>
                  <ListItemText primary="Recent" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}
