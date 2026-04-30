import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { setToken } from '../utils/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(form)
      setToken(result.token)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to sign in right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Notary by MKR</p>
        <h1 className="mt-2 text-4xl font-extrabold text-ink">Sign In</h1>
        <p className="mt-2 text-lg text-slate-700">Use your office login to manage notary requests.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-lg font-semibold text-slate-800">Username</span>
            <input
              required
              name="username"
              value={form.username}
              onChange={updateField}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-xl"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-lg font-semibold text-slate-800">Password</span>
            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={updateField}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-xl"
            />
          </label>

          {error && <p className="rounded-lg bg-red-50 p-3 text-base font-semibold text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-2xl font-bold text-white disabled:opacity-70"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  )
}
