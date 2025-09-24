export function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleString()
  } catch {
    return ''
  }
}
