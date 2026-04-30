import { AlertTriangle, Calendar, Clock3, FileText, MapPin, Phone } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import StatusBadge from '../components/StatusBadge'
import { getRequestDetail, updateRequestStatus } from '../services/api'

const actions = [
  { status: 'approved', label: 'Approve' },
  { status: 'denied', label: 'Deny' },
  { status: 'called', label: 'Mark Called' },
  { status: 'needs_callback', label: 'Needs Callback' },
  { status: 'closed', label: 'Close' },
]

function Field({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      </div>
      <p className="mt-1 text-[14px] text-slate-900">{value || 'N/A'}</p>
    </div>
  )
}

export default function RequestDetailPage() {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [notes, setNotes] = useState('')
  const [updating, setUpdating] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    let active = true

    async function loadDetail() {
      setLoading(true)
      const result = await getRequestDetail(id)
      if (!active) return

      setDetail(result)
      setError(result.source === 'mock' ? 'Detail API unavailable, showing fallback record.' : '')
      setLoading(false)
    }

    loadDetail()
    return () => {
      active = false
    }
  }, [id])

  const request = useMemo(() => detail?.call, [detail])

  async function handleStatus(status) {
    if (!request || updating) return
    setActionError('')
    setMessage('')
    setUpdating(true)
    const result = await updateRequestStatus(request.call_id, status, notes)
    if (!result.success) {
      setActionError(result.error || 'Failed to update status.')
      setUpdating(false)
      return
    }

    setDetail((prev) => ({ ...prev, call: { ...prev.call, call_status: status } }))
    setMessage(`Status updated to ${status.replace('_', ' ')}.`)
    setUpdating(false)
  }

  async function handleSaveNotes() {
    if (!request || savingNotes) return
    setActionError('')
    setMessage('')
    setSavingNotes(true)

    const result = await updateRequestStatus(request.call_id, request.call_status || 'new', notes)
    if (!result.success) {
      setActionError(result.error || 'Failed to save notes.')
      setSavingNotes(false)
      return
    }

    setMessage('Notes saved.')
    setSavingNotes(false)
  }

  if (loading) return <LoadingState label="Loading request detail..." />

  if (!request) {
    return (
      <section className="space-y-4">
        <ErrorState message="Request detail could not be loaded." />
        <Link to="/" className="inline-flex rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white">
          Back to Dashboard
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      {error ? <ErrorState message={error} /> : null}

      <article className="rounded-2xl border border-slate-200 bg-white px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold text-slate-900">{request.caller_name}</h2>
            <p className="mt-1 text-[13px] text-slate-400">Call ID: {request.call_id}</p>
          </div>
          <StatusBadge status={request.call_status} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field icon={Phone} label="Phone" value={request.caller_phone} />
          <Field icon={FileText} label="Service" value={request.service_type} />
          <Field icon={FileText} label="Document" value={request.document_type} />
          <Field icon={MapPin} label="Address" value={request.location_address} />
          <Field icon={Calendar} label="Preferred Date" value={request.preferred_date} />
          <Field icon={Clock3} label="Preferred Time" value={request.preferred_time} />
          <Field icon={AlertTriangle} label="Urgency" value={request.urgency} />
          <Field icon={Phone} label="Needs Callback" value={request.needs_michael_callback ? 'Yes' : 'No'} />
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Call Summary</p>
            <p className="mt-1 text-[14px] text-slate-900">{request.call_summary || 'No summary available.'}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Missing Info</p>
            <p className="mt-1 text-[14px] text-slate-900">{request.missing_info || 'None noted.'}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[14px] text-slate-900">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Price Mentioned</p>
              <p>{request.price_mentioned ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[14px] text-slate-900">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Quoted Price</p>
              <p>{request.quoted_price ? `$${request.quoted_price}` : 'N/A'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[14px] text-slate-900">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Confidence Score</p>
              <p>{request.confidence_score || 0}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Transcript</p>
            <p className="mt-1 max-h-[240px] overflow-y-auto whitespace-pre-wrap text-[14px] text-slate-900">
              {detail?.transcript || 'Transcript unavailable.'}
            </p>
          </div>

          {detail?.recording_url ? (
            <a
              href={detail.recording_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-[14px] font-semibold text-slate-900"
            >
              Open Recording
            </a>
          ) : null}
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Michael Notes</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900"
            placeholder="Add note to send with status update"
          />
          <button
            type="button"
            disabled={savingNotes}
            onClick={handleSaveNotes}
            className="mt-3 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {savingNotes ? 'Saving Notes...' : 'Save Notes'}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <button
              key={action.status}
              type="button"
              disabled={updating}
              onClick={() => handleStatus(action.status)}
              className={`rounded-lg px-4 py-2.5 text-[14px] font-semibold transition disabled:opacity-60 ${
                action.status === 'approved'
                  ? 'bg-slate-900 text-white hover:opacity-90'
                  : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>

        {message ? <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[13px] font-medium text-emerald-800">{message}</p> : null}
        {actionError ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-[13px] font-medium text-rose-800">{actionError}</p> : null}
      </article>
    </section>
  )
}
