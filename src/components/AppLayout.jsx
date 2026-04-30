import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearToken } from '../utils/auth'

export default function AppLayout() {
  const navigate = useNavigate()

  function handleLogout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/55 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Notary by MKR</p>
            <h1 className="text-3xl font-bold text-slate-900">CRM Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/70 bg-white/70 px-4 py-2 text-base font-semibold text-slate-700"
          >
            Logout
          </button>
        </div>

        <nav className="mx-auto flex w-full max-w-6xl gap-2 px-4 pb-4 sm:px-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-base font-semibold transition ${
                isActive ? 'bg-slate-800 text-white' : 'bg-white/70 text-slate-700'
              }`
            }
          >
            Dashboard
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
