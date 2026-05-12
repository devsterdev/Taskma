export const THEME_STORAGE_KEY = 'taskma-theme'

export const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === 'dark') {
    return true
  }

  if (savedTheme === 'light') {
    return false
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}
