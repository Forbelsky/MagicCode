/**
 * ProfilePage (stránka profilu)
 * ------------------------------------------------------------
 * Co to je:
 *  - Nejvyšší obrazovka (page-level) skládající hlavičku, postranní panel,
 *    editor, aktivitu a patičku.
 *
 * Jaké stavy řídí:
 *  - activeSubject, activeTopic: zvolený předmět a téma v postranním panelu.
 *  - sidebarCollapsed: zda je postranní panel "zúžený".
 *  - isFavorite: příznak oblíbenosti aktuální poznámky.
 *  - mode: režim editoru ("edit" / "preview").
 *  - noteContent: HTML obsahu poznámky (TipTap).
 *
 * Jak teče data:
 *  - Tady (na úrovni stránky) držíme stav a předáváme ho dětem přes props.
 *  - Dětské komponenty (Sidebar, EditorCard) volají callbacky, které mění stav zde.
 *
 * Jak to napojit na backend:
 *  - Funkce saveNote je připravená volat API (např. POST /api/notes).
 *  - Na backendu lze udržovat seznam "stránek" a přepínat mezi nimi (viz přiložený backend example).
 */
import { useState } from 'react'
import {Box, Container, Grid, Stack, Toolbar, Typography, useTheme, useMediaQuery} from '@mui/material'
import AppHeader from '../components/profile/AppHeader.jsx'
import Sidebar from '../components/profile/Sidebar.jsx'
import EditorCard from '../components/profile/EditorCard.jsx'
import RecentActivity from '../components/profile/RecentActivity.jsx'
import { useUserContext } from '../app/UserProvider.jsx'

export default function ProfilePage() {
  // ---- Stav obrazovky (UI + doména) ----------------------------------------
  const [activeSubject, setActiveSubject] = useState('Mathematics')   // vybraný předmět v postranním panelu
  const [activeTopic, setActiveTopic] = useState('Algebra')           // vybrané téma v rámci předmětu
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)     // šířka/zbalení postranního panelu
  const [isFavorite, setIsFavorite] = useState(false)                 // příznak oblíbenosti pro aktuální poznámku/téma
  const [mode, setMode] = useState('edit')                            // 'edit' nebo 'preview' (TipTap editovatelný režim)
  const [noteContent, setNoteContent] = useState('<p>Start writing your notes here...</p>') // HTML obsah poznámky

  // Aktuálně přihlášený uživatel ze sdíleného UserContextu
  const { user } = useUserContext()

  // Responsivní chování: na menších displejích sidebar automaticky sbalíme
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  const effectiveCollapsed = sidebarCollapsed || mdDown

  /**
   * Uložení poznámky
   * V tuto chvíli pouze loguje do konzole. V reálné aplikaci zde:
   *  - zavolejte fetch('/api/notes', { method: 'POST', body: JSON.stringify({ subject: activeSubject, topic: activeTopic, html: noteContent }), headers: { 'Content-Type': 'application/json' } })
   *  - ošetřete chyby a zobrazte notifikaci uživateli
   */
  const saveNote = () => {
    // eslint-disable-next-line no-console
    console.log('Note saved:', { subject: activeSubject, topic: activeTopic, html: noteContent })
  }




  return (
    // ---- Aplikační "shell": hlavička + sidebar + hlavní obsah --------------
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 50%, #ec4899 100%)',
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

      {/* Horní lišta s menu/účtem a tlačítkem pro sbalení sidebaru */}
      <AppHeader onToggleSidebar={() => setSidebarCollapsed((v) => !v)} />

      {/* Postranní panel (permanentní drawer) s výběrem předmětů a témat.
          Změny zde volají setActiveSubject / setActiveTopic a tím přepíšou stav stránky. */}
      <Sidebar
        collapsed={effectiveCollapsed}
        activeSubject={activeSubject}
        setActiveSubject={setActiveSubject}
        activeTopic={activeTopic}
        setActiveTopic={setActiveTopic}
      />

      {/* Hlavní scrollovatelná oblast */}
      <Box component="main" sx={{ flexGrow: 1, overflowX: 'auto' }}>
        {/* Odstup pro fixní AppBar nahoře (aby obsah nezačínal pod ním) */}
        <Toolbar />

        {/* Kontejner hlavního obsahu – plná šířka, ale s responzivním odsazením */}
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            mx: 'auto',
            maxWidth: { xs: '100%', sm: '92vw', xl: '1600px' },
            py: { xs: 'clamp(12px, 2.5vh, 24px)', md: 'clamp(16px, 3vh, 32px)' },
            px: { xs: 'clamp(12px, 2vw, 24px)', md: 'clamp(16px, 2.5vw, 40px)' },
          }}
        >
          {/* Titulek stránky a doplňující informace */}
          <Stack spacing={2} sx={{ mb: 2 }} direction="row" alignItems="flex-start" justifyContent="space-between">
            {/* Levá část: titul a meta */}
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{activeTopic}</Typography>
              <Typography variant="body2" color="text.secondary">
                Subject: {activeSubject} • Last edited: Just now
              </Typography>
            </Box>


          </Stack>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} lg={8} xl={9}>
              {/* EditorCard: TipTap editor + toolbar + akce */}
              <EditorCard
                activeSubject={activeSubject}
                activeTopic={activeTopic}
                html={noteContent}
                onChange={setNoteContent}
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
                mode={mode}
                setMode={setMode}
                onSave={saveNote}
              />
            </Grid>
            <Grid item xs={12} lg={4} xl={3}>
              {/* Sekce s poslední aktivitou / feedem událostí */}
              <RecentActivity />
            </Grid>
          </Grid>
        </Container>

        {/* Jednoduchá patička s odkazy a stavem */}
        <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', py: 3 }}>
        <Container maxWidth={false} disableGutters sx={{ py: 2, px: 0 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ px: { xs: 2, sm: 3 } }}>
              <Typography variant="body2" color="text.secondary">© 2024 EduNotes • Making education accessible</Typography>
              <Stack direction="row" spacing={3}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Support</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Documentation</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>API</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Status</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">v1.2.0</Typography>
                <Typography variant="body2" color="#16a34a">●</Typography>
                <Typography variant="body2" color="text.secondary">Online</Typography>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}
