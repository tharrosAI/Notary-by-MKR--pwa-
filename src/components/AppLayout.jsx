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
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-6 py-4">
          <div>
            <p className="text-[13px] text-slate-400">Notary by MKR</p>
            <h1 className="text-[22px] font-semibold text-slate-900">CRM Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[14px] font-semibold text-slate-900"
          >
            Logout
          </button>
        </div>

        <nav className="mx-auto flex w-full max-w-[1100px] gap-2 px-6 pb-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 text-[14px] font-semibold transition ${
                isActive ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-900'
              }`
            }
          >
            Dashboard
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
