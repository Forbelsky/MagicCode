import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import './index.css'
import './styles/globals.css'
import App from './App.jsx'
import { UserProvider } from './app/UserProvider.jsx'

let theme = createTheme({
  palette: {
    mode: 'light',
    // Unified palette aligned with the app background (blue -> purple -> pink)
    primary: { main: '#0ea5e9' },     // sky-500
    secondary: { main: '#7c3aed' },   // violet-600
    info: { main: '#ec4899' },        // pink-500
    text: {
      primary: '#111827',             // slate-900
      secondary: 'rgba(17,24,39,0.7)',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    // Make all icons default to inherit text color unless overridden
    MuiSvgIcon: {
      defaultProps: { color: 'inherit', fontSize: 'medium' },
      styleOverrides: { root: { color: 'inherit' } },
    },
    // IconButtons also inherit color from surrounding text
    MuiIconButton: {
      defaultProps: { color: 'inherit' },
      styleOverrides: { root: { color: 'inherit' } },
    },
    // Ensure list item icons also inherit
    MuiListItemIcon: {
      styleOverrides: { root: { color: 'inherit' } },
    },
  },
})
theme = responsiveFontSizes(theme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)
