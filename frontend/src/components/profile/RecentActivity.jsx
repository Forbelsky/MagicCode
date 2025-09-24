// RecentActivity: simple, static cards showing recent events.
// Replace with real data (API) or pass a list of events as props later.
import { Avatar, Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { NoteAddOutlinedIcon, EditOutlinedIcon } from './icons'

export default function RecentActivity() {
  return (
    <Box sx={{ px: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Card sx={{ flex: 1, borderColor: '#fecaca', background: 'linear-gradient(90deg,#fff1f2,#fff7ed)' }} variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#fee2e2', color: '#ef4444' }}><NoteAddOutlinedIcon /></Avatar>
              <Box>
                <Typography fontWeight={600} color="#b91c1c">Document Created</Typography>
                <Typography variant="body2" color="#ef4444">2 minutes ago</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, borderColor: '#fed7aa', background: 'linear-gradient(90deg,#fff7ed,#fffbeb)' }} variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#ffedd5', color: '#f97316' }}><EditOutlinedIcon /></Avatar>
              <Box>
                <Typography fontWeight={600} color="#9a3412">Content Updated</Typography>
                <Typography variant="body2" color="#f97316">Just now</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  )
}
