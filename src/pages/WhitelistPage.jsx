import { useState } from 'react'
import { submitWhitelistContact } from '../services/api'

export default function WhitelistPage() {
  const [form, setForm] = useState({ name: '', phone_number: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSuccess('')
    setError('')

    if (!form.phone_number.trim()) {
      setError('Phone number is required.')
      return
    }

    setLoading(true)

    try {
      await submitWhitelistContact({
        name: form.name.trim(),
        phone_number: form.phone_number.trim(),
        notes: form.notes.trim(),
      })
      setSuccess('Whitelist contact added.')
      setForm({ name: '', phone_number: '', notes: '' })
    } catch (submitError) {
      setError(submitError.message || 'Unable to add whitelist contact.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-400">Whitelist</h2>
        <p className="mt-2 text-[14px] text-slate-700">Add contacts who should bypass the AI and ring Michael directly.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium text-slate-900">Name</span>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] text-slate-900"
              placeholder="Optional"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[13px] font-medium text-slate-900">Phone Number</span>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={updateField}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] text-slate-900"
              placeholder="Required"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[13px] font-medium text-slate-900">Notes</span>
            <textarea
              rows={4}
              name="notes"
              value={form.notes}
              onChange={updateField}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] text-slate-900"
              placeholder="Optional"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Add to Whitelist'}
          </button>
        </form>

        {success ? <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-emerald-800">{success}</p> : null}
        {error ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-800">{error}</p> : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-400">Contacts</h3>
        <p className="mt-2 text-[14px] text-slate-700">Whitelist contacts will appear here once connected.</p>
      </div>
    </section>
  )
}
