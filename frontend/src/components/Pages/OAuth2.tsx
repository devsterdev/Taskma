import { CheckCircle2, Moon, Sun } from 'lucide-react'
import { API_BASE_URL } from '../../utils/api'

const OAuth2 = ({
  isDarkMode,
  onThemeToggle
}: {
  isDarkMode: boolean
  onThemeToggle: (isDark: boolean) => void
}) => {
  const pageClass = isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
  const mutedClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
  const panelClass = isDarkMode
    ? 'border-zinc-800 bg-[#121212] shadow-black/30'
    : 'border-zinc-200 bg-white shadow-zinc-200/70'
  const iconButtonClass = isDarkMode
    ? 'border-zinc-800 bg-[#181818] text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white'
    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950'
  const googleButtonClass = isDarkMode
    ? 'border-zinc-700 bg-white text-zinc-950 hover:bg-zinc-200'
    : 'border-zinc-300 bg-zinc-950 text-white hover:bg-zinc-800'

    const googleLogin = () => {
      window.location.href =
      `${API_BASE_URL}/auth/google`;
    };
  return (
    <main className={`flex min-h-screen items-center justify-center px-4 ${pageClass}`}>
      <button
        type="button"
        onClick={() => onThemeToggle(!isDarkMode)}
        className={`absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${iconButtonClass}`}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <section className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-current">
            <CheckCircle2
              size={25}
              className={isDarkMode ? 'text-black' : 'text-white'}
            />
          </div>
          <h1 className="mb-2 text-4xl font-bold">Taskma</h1>
          <p className={mutedClass}>Create your account to continue</p>
        </div>

        <div className={`rounded-xl border p-6 shadow-xl ${panelClass}`}>
          <button
            type="button"
            className={`flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 font-semibold transition-colors ${googleButtonClass}`}
            onClick={googleLogin}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
              G
            </span>
            Sign up with Google
          </button>
        </div>
      </section>
    </main>
  )
}

export default OAuth2
