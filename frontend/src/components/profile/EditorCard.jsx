// EditorCard: TipTap editor with toolbar, actions, and a thin stats bar.
// Dynamically sizes the editor to end just above the viewport bottom for a "no-scroll" feel.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
    Tooltip
} from '@mui/material'
import {
    SearchOutlinedIcon,
    TuneOutlinedIcon,
    SaveOutlinedIcon,
    ImageOutlinedIcon,
    AttachFileOutlinedIcon,
    PictureAsPdfOutlinedIcon,
    ShareOutlinedIcon,
    FavoriteBorderOutlinedIcon,
    FavoriteIcon,
    CodeOutlinedIcon,
    VisibilityOutlinedIcon,
    FormatBoldIcon,
    FormatItalicIcon,
    FormatListBulletedIcon,
    FormatListNumberedIcon,
    CleaningServicesOutlinedIcon,
    MoreVertIcon,
    LooksOneIcon,
    LooksTwoIcon,
    Looks3Icon,
    FormatAlignLeftIcon,
    FormatAlignCenterIcon,
    FormatAlignRightIcon,
    FormatAlignJustifyIcon,
    TableChartIcon,
    BorderAllIcon,
    BorderClearIcon,
    ViewWeekIcon,
    ViewColumnIcon,
    RemoveIcon,
    DeleteOutlineIcon,
    CallMergeIcon,
    CallSplitIcon
} from './icons'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Heading } from '@tiptap/extension-heading'
import { TextAlign } from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'

/**
 * @param {object} props
 * @param {string} props.activeSubject - Current subject (for subtitle).
 * @param {string} props.activeTopic - Current topic (for title).
 * @param {string} props.html - Editor HTML content (controlled).
 * @param {(html:string)=>void} props.onChange - Called on content update.
 * @param {boolean} props.isFavorite - Favorite flag.
 * @param {(fn:(prev:boolean)=>boolean)=>void} props.setIsFavorite - Toggles favorite.
 * @param {'edit'|'preview'} props.mode - Current editor mode.
 * @param {(mode:'edit'|'preview')=>void} props.setMode - Toggles editor mode.
 * @param {() => void} props.onSave - Save handler.
 */
export default function EditorCard({ activeSubject, activeTopic, html, onChange, isFavorite, setIsFavorite, mode, setMode, onSave }) {
  // Refs + local UI state
  const editorPaperRef = useRef(null)    // measures available height for the editor
  const statsRef = useRef(null)          // height of the stats bar below editor
  const [editorHeight, setEditorHeight] = useState(480)
  const [actionAnchor, setActionAnchor] = useState(null)

  // TipTap instance; controlled via "html" prop; onUpdate lifts HTML back up.
  const isClient = typeof window !== 'undefined'
  const editor = useEditor(
    isClient
      ? {
          extensions: [
            StarterKit,
            Heading.configure({ levels: [1, 2, 3] }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
          ],
          content: html,
          immediatelyRender: false,
          editorProps: { attributes: { style: 'padding: 12px; outline: none;' } },
          onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
        }
      : null
  )

  // Reflect mode to TipTap editable state
  useEffect(() => {
    if (editor) editor.setEditable(mode === 'edit')
  }, [editor, mode])

  // Dynamically compute height so the editor ends above the viewport bottom.
  // Recalculates on resize and scroll (for sticky header offsets etc.).
  useLayoutEffect(() => {
    const recalc = () => {
      const el = editorPaperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const statsH = statsRef.current?.offsetHeight || 0
      const bottomGap = 12 + statsH
      const available = Math.max(240, Math.floor(window.innerHeight - rect.top - bottomGap))
      setEditorHeight(available)
    }
    recalc()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(recalc) : null
    ro?.observe(document.body)
    window.addEventListener('resize', recalc)
    window.addEventListener('scroll', recalc, true)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', recalc)
      window.removeEventListener('scroll', recalc, true)
    }
  }, [])

  // Derived stats from the current HTML (SSR-safe)
  const stats = useMemo(() => {
    const getText = () => {
      if (!html) return ''
      if (typeof document !== 'undefined') {
        const tmp = document.createElement('div')
        tmp.innerHTML = html
        return tmp.textContent || tmp.innerText || ''
      }
      // Fallback for SSR: strip tags without DOM
      return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    }

    const text = getText()
    const words = text ? (text.trim().match(/\S+/g) || []).length : 0
    const chars = text.length
    const readMinutes = Math.max(1, Math.ceil(words / 200))
    return { words, chars, readMinutes }
  }, [html])

  return (
      // maxWidth limits line length on very large screens; remove if you want full-bleed editor
      <Card sx={{ width: '100%', mx: 0 }}>
      <CardHeader
        title="Content Editor"
        subheader={`Editing notes for ${activeTopic} in ${activeSubject}`}
        action={
          // Right-aligned quick actions in header
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton><SearchOutlinedIcon /></IconButton>
            <IconButton><TuneOutlinedIcon /></IconButton>
            <Button size="small" variant="contained" startIcon={<SaveOutlinedIcon />} onClick={() => onSave?.()} sx={{ backgroundImage: 'linear-gradient(90deg,#0ea5e9,#7c3aed)' }}>
              Save
            </Button>
            <IconButton onClick={(e) => setActionAnchor(e.currentTarget)}><MoreVertIcon /></IconButton>
          </Stack>
        }
      />
      {/* Overflow menu for secondary actions */}
      <Menu anchorEl={actionAnchor} open={Boolean(actionAnchor)} onClose={() => setActionAnchor(null)} elevation={2}>
        <MenuItem onClick={() => { console.log('Insert Image'); setActionAnchor(null) }}>
          <ListItemIcon><ImageOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Insert Image</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { console.log('Attach File'); setActionAnchor(null) }}>
          <ListItemIcon><AttachFileOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Attach File</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { console.log('Export PDF'); setActionAnchor(null) }}>
          <ListItemIcon><PictureAsPdfOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Export PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { console.log('Share'); setActionAnchor(null) }}>
          <ListItemIcon><ShareOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setIsFavorite?.((v) => !v); setActionAnchor(null) }}>
          <ListItemIcon>{isFavorite ? <FavoriteIcon fontSize="small" color="secondary" /> : <FavoriteBorderOutlinedIcon fontSize="small" />}</ListItemIcon>
          <ListItemText>{isFavorite ? 'Unfavorite' : 'Favorite'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setMode?.((m) => (m === 'edit' ? 'preview' : 'edit')); setActionAnchor(null) }}>
          <ListItemIcon>{mode === 'edit' ? <VisibilityOutlinedIcon fontSize="small" /> : <CodeOutlinedIcon fontSize="small" />}</ListItemIcon>
          <ListItemText>{mode === 'edit' ? 'Preview' : 'Edit'}</ListItemText>
        </MenuItem>
      </Menu>

      <CardContent sx={{ p: 0 }}>
        <Stack spacing={1.5} sx={{ width: '100%' }}>
          {/* Formatting toolbar (left tools) and mode switch (right) */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            sx={{ px: 0, gap: 1, color: 'text.primary', '& .MuiIconButton-root': { color: 'inherit' } }}
          >
            {/* Left tools: marks, lists, headings, alignment, tables */}
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              {/* Marks & lists */}
              <Tooltip title="Bold (Ctrl+B)"><IconButton onClick={() => editor?.chain().focus().toggleBold().run()}><FormatBoldIcon /></IconButton></Tooltip>
              <Tooltip title="Italic (Ctrl+I)"><IconButton onClick={() => editor?.chain().focus().toggleItalic().run()}><FormatItalicIcon /></IconButton></Tooltip>
              <Tooltip title="Bullet list"><IconButton onClick={() => editor?.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon /></IconButton></Tooltip>
              <Tooltip title="Ordered list"><IconButton onClick={() => editor?.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon /></IconButton></Tooltip>
              <Tooltip title="Clear formatting"><IconButton onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}><CleaningServicesOutlinedIcon /></IconButton></Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Headings */}
              <Tooltip title="Heading 1"><IconButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}><LooksOneIcon /></IconButton></Tooltip>
              <Tooltip title="Heading 2"><IconButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}><LooksTwoIcon /></IconButton></Tooltip>
              <Tooltip title="Heading 3"><IconButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}><Looks3Icon /></IconButton></Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Alignment */}
              <Tooltip title="Align left"><IconButton onClick={() => editor?.chain().focus().setTextAlign('left').run()}><FormatAlignLeftIcon /></IconButton></Tooltip>
              <Tooltip title="Align center"><IconButton onClick={() => editor?.chain().focus().setTextAlign('center').run()}><FormatAlignCenterIcon /></IconButton></Tooltip>
              <Tooltip title="Align right"><IconButton onClick={() => editor?.chain().focus().setTextAlign('right').run()}><FormatAlignRightIcon /></IconButton></Tooltip>
              <Tooltip title="Justify"><IconButton onClick={() => editor?.chain().focus().setTextAlign('justify').run()}><FormatAlignJustifyIcon /></IconButton></Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {/* Tables */}
              <Tooltip title="Insert table (3x3)">
                <IconButton onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                  <TableChartIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle header row">
                <IconButton disabled={!editor?.isActive('table')} onClick={() => editor?.chain().focus().toggleHeaderRow().run()}>
                  <BorderAllIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add row after">
                <IconButton disabled={!editor?.isActive('table')} onClick={() => editor?.chain().focus().addRowAfter().run()}>
                  <ViewWeekIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add column after">
                <IconButton disabled={!editor?.isActive('table')} onClick={() => editor?.chain().focus().addColumnAfter().run()}>
                  <ViewColumnIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete row">
                <IconButton disabled={!editor?.isActive('table')} onClick={() => editor?.chain().focus().deleteRow().run()}>
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete column">
                <IconButton disabled={!editor?.isActive('table')} onClick={() => editor?.chain().focus().deleteColumn().run()}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Merge cells">
                <IconButton disabled={!editor?.isActive('table')} onClick={() => editor?.chain().focus().mergeCells().run()}>
                  <CallMergeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Split cell">
                <IconButton disabled={!editor?.isActive('table')} onClick={() => editor?.chain().focus().splitCell().run()}>
                  <CallSplitIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete table">
                <IconButton disabled={!editor?.isActive('table')} onClick={() => editor?.chain().focus().deleteTable().run()}>
                  <BorderClearIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Right tools: mode switcher */}
            <Stack direction="row" spacing={1}>
              <Button size="small" variant={mode === 'edit' ? 'contained' : 'outlined'} startIcon={<CodeOutlinedIcon />} onClick={() => setMode?.('edit')} sx={{ borderWidth: mode === 'edit' ? undefined : 2 }}>
                Edit
              </Button>
              <Button size="small" variant={mode === 'preview' ? 'contained' : 'outlined'} startIcon={<VisibilityOutlinedIcon />} onClick={() => setMode?.('preview')} sx={{ borderWidth: mode === 'preview' ? undefined : 2 }}>
                Preview
              </Button>
            </Stack>
          </Stack>

          {/* TipTap editor area; height is controlled by "editorHeight" for dynamic sizing */}
          <Paper
            ref={editorPaperRef}
            variant="outlined"
            sx={{
              borderColor: 'divider',
              width: '100%',
              height: `${editorHeight}px`,
              overflow: 'auto',
              borderRadius: 0,
                backgroundColor: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(10px)',
              '& .ProseMirror': { minHeight: '100%', height: '100%', width: '100%', outline: 'none', padding: '12px' },
            }}
          >
            {editor ? (
              <EditorContent editor={editor} />
            ) : (
              <Box sx={{ p: 2, color: 'text.secondary' }}>Loading editor…</Box>
            )}
          </Paper>

          {/* Lightweight stats (words/chars/estimated read time) */}
          <Box ref={statsRef} sx={{ display: 'flex', gap: { xs: 2, md: 3 }, fontSize: 12, color: 'text.secondary', borderTop: '1px solid', borderColor: 'divider', pt: 1, px: { xs: 1, sm: 2 }, flexWrap: 'wrap', width: '100%' }}>
            <span>{stats.words} words</span>
            <span>{stats.chars} characters</span>
            <span>~{stats.readMinutes} min read</span>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
