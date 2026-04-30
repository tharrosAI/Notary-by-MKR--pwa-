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
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Notary by MKR</p>
            <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-700"
          >
            Log Out
          </button>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-2 px-4 pb-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-base font-semibold ${
                isActive ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
              }`
            }
          >
            Requests
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-base font-semibold ${
                isActive ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
              }`
            }
          >
            Availability
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-5">
        <Outlet />
      </main>
    </div>
  )
}
