import { useEffect, useState } from 'react'
import { getWhitelistContacts, submitWhitelistContact } from '../services/api'

export default function WhitelistPage() {
  const [form, setForm] = useState({ name: '', phone_number: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [contacts, setContacts] = useState([])
  const [contactsLoading, setContactsLoading] = useState(true)
  const [contactsError, setContactsError] = useState('')

  async function loadContacts() {
    setContactsLoading(true)
    const result = await getWhitelistContacts()
    setContacts(result.contacts)
    setContactsError(result.error)
    setContactsLoading(false)
  }

  useEffect(() => {
    loadContacts()
  }, [])

  function isActiveContact(value) {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') return ['true', 'yes', '1'].includes(value.toLowerCase())
    return false
  }

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
      await loadContacts()
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
        {contactsLoading ? <p className="mt-2 text-[14px] text-slate-700">Loading contacts...</p> : null}
        {!contactsLoading && contactsError ? <p className="mt-2 text-[14px] text-slate-700">Unable to load contacts right now.</p> : null}
        {!contactsLoading && !contacts.length ? (
          <p className="mt-2 text-[14px] text-slate-700">Whitelist contacts will appear here once connected.</p>
        ) : null}

        {!contactsLoading && contacts.length ? (
          <ul className="mt-4 space-y-3">
            {contacts.map((contact, index) => (
              <li key={`${contact.phone_number || 'contact'}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-slate-900">{contact.name?.trim() || 'Unnamed Contact'}</p>
                    <p className="mt-1 text-[14px] text-slate-700">{contact.phone_number || 'N/A'}</p>
                  </div>
                  {isActiveContact(contact.active) ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">Active</span>
                  ) : null}
                </div>

                {contact.notes ? <p className="mt-3 text-[13px] text-slate-700">{contact.notes}</p> : null}
                {contact.created_at ? <p className="mt-2 text-[12px] text-slate-500">Created {contact.created_at}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
