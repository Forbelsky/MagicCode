import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Grid,
  Avatar,
  Link,
  Chip,
  InputAdornment,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import DevicesIcon from '@mui/icons-material/Devices'
import { useUserContext } from '../app/UserProvider.jsx'


/**
 * LoginPage
 * Backendové ověření – volá login({ username, password }) ze sdíleného UserContextu.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const { login, loading, error } = useUserContext()

  const theme = useTheme()
  const belowFHD = useMediaQuery('(max-width:1919.98px)')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    try {
      await login({ username, password })
      // po úspěchu se App automaticky přepne (isAuthenticated z contextu je true)
    } catch (err) {
      setFormError(err.message || 'Přihlášení selhalo')
    }
  }

  const Feature = ({ icon, children }) => (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: 'common.white' }}>
      <CheckCircleOutlineIcon sx={{ color: 'inherit' }} />
      <Typography variant="body1" sx={{ opacity: 0.95 }}>
        {children}
      </Typography>
    </Stack>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 50%, #ec4899 100%)',
      }}
    >
      {/* jemné světelné efekty v pozadí */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(600px circle at 20% 10%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(500px circle at 80% 60%, rgba(255,255,255,0.25), transparent 40%)',
          opacity: 0.6,
          filter: 'saturate(1.1)',
        }}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 }, position: 'relative' }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          {/* LEVÝ HERO PANEL */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3} sx={{ color: 'common.white' }}>
              <Chip
                label="Vítejte zpět"
                variant="outlined"
                sx={{
                  alignSelf: 'flex-start',
                  color: 'common.white',
                  borderColor: 'rgba(255,255,255,0.6)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  fontWeight: 600,
                }}
              />
              <Typography variant="h3" fontWeight={800} lineHeight={1.15}>
                Přihlaste se do své pracovní zóny
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 560 }}>
                Zůstaňte produktivní s bezpečným a rychlým přístupem odkudkoliv.
              </Typography>

              <Stack spacing={2} mt={1}>
                <Feature icon={<SecurityIcon />}>Bezpečné přihlášení a ochrana účtu</Feature>
                <Feature icon={<SpeedIcon />}>Rychlý přístup k vašim datům</Feature>
                <Feature icon={<DevicesIcon />}>Funguje na počítači, tabletu i telefonu</Feature>
              </Stack>
            </Stack>
          </Grid>


          {/* PRAVÝ PANEL – FORMULÁŘ */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={8}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                backdropFilter: 'blur(6px)',
                backgroundColor: 'rgba(255,255,255,0.92)',
              }}
            >
              <Stack spacing={2.5}>
                <Stack spacing={1} alignItems="center" textAlign="center">
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 56,
                      height: 56,
                      boxShadow: 2,
                    }}
                  >
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight={800}>
                    Přihlášení
                  </Typography>
                </Stack>

                {(formError || error) && (
                  <Alert severity="error">{formError || error?.message}</Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      label="Uživatelské jméno"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      autoFocus
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon fontSize="small" sx={{ color: 'text.primary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Heslo"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon fontSize="small" sx={{ color: 'text.primary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      fullWidth
                    >
                      {loading ? 'Přihlašuji…' : 'Přihlásit se'}
                    </Button>
                  </Stack>
                </Box>

                <Divider />
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Link href="#" underline="hover" color="text.secondary">
                    Zapomněli jste heslo?
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    Potřebujete účet? Kontaktujte správce.
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: { xs: 6, md: 10 },
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
          }}
        >
          © {new Date().getFullYear()} Vaše aplikace
        </Typography>
      </Container>
    </Box>
  )
}
