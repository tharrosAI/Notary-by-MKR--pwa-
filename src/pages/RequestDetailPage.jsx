import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRequestById, postRequestAction } from '../services/api'

const actions = [
  { key: 'approve', label: 'Approve', classes: 'bg-emerald-600 text-white' },
  { key: 'deny', label: 'Deny', classes: 'bg-rose-600 text-white' },
  { key: 'called', label: 'Mark Called', classes: 'bg-sky-600 text-white' },
]

export default function RequestDetailPage() {
  const { id } = useParams()
  const [request, setRequest] = useState(null)
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    async function loadRequest() {
      const data = await getRequestById(id)
      if (active) {
        setRequest(data || null)
      }
    }

    loadRequest()
    return () => {
      active = false
    }
  }, [id])

  async function handleAction(action) {
    if (!request) return
    const result = await postRequestAction(request.id, action, note)
    setMessage(`Saved ${action} action (${result.source}).`)
  }

  async function handleAddNote() {
    if (!request || !note.trim()) return
    const result = await postRequestAction(request.id, 'add_note', note)
    setMessage(`Saved note (${result.source}).`)
    setRequest((prev) => ({ ...prev, notes: [...(prev.notes || []), note] }))
    setNote('')
  }

  if (!request) {
    return (
      <section className="space-y-4">
        <p className="text-xl font-semibold text-slate-700">Request not found.</p>
        <Link to="/" className="inline-block rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-700">
          Back to Dashboard
        </Link>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <h2 className="text-3xl font-bold text-ink">{request.clientName}</h2>
      <p className="mt-1 text-lg text-slate-700">{request.serviceType}</p>

      <dl className="mt-4 space-y-1 text-lg text-slate-800">
        <div><span className="font-bold">Date:</span> {request.date}</div>
        <div><span className="font-bold">Time:</span> {request.time}</div>
        <div><span className="font-bold">Location:</span> {request.location}</div>
        <div><span className="font-bold">Phone:</span> {request.phone}</div>
      </dl>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => handleAction(action.key)}
            className={`rounded-xl px-4 py-3 text-xl font-bold ${action.classes}`}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label className="mb-1 block text-lg font-semibold text-slate-800">Add Note</label>
        <textarea
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg"
          placeholder="Add follow-up note for this request"
        />
        <button onClick={handleAddNote} className="mt-3 rounded-xl bg-brand-600 px-4 py-3 text-xl font-bold text-white">
          Add Note
        </button>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold text-ink">Notes</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-lg text-slate-700">
          {(request.notes || []).length > 0 ? (
            request.notes.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)
          ) : (
            <li>No notes yet.</li>
          )}
        </ul>
      </div>

      {message && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-base font-semibold text-emerald-800">{message}</p>}
    </section>
  )
}
