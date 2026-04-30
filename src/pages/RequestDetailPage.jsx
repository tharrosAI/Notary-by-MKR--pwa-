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
    <div className="flex items-start gap-3 rounded-xl bg-slate-50/80 p-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
      <p className="text-base text-slate-700">
        <span className="font-semibold text-slate-900">{label}:</span> {value || 'N/A'}
      </p>
    </div>
  )
}

export default function RequestDetailPage() {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [notes, setNotes] = useState('')
  const [updating, setUpdating] = useState(false)

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
    setUpdating(true)
    const result = await updateRequestStatus(request.call_id, status, notes)
    setDetail((prev) => ({ ...prev, call: { ...prev.call, call_status: status } }))
    setMessage(`Status updated to ${status.replace('_', ' ')} (${result.source}).`)
    setUpdating(false)
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

      <article className="rounded-[20px] border border-white/70 bg-white/65 p-6 shadow-[0_28px_60px_-28px_rgba(15,23,42,0.55)] backdrop-blur-md">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{request.caller_name}</h2>
            <p className="mt-1 text-base text-slate-700">Call ID: {request.call_id}</p>
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
          <div className="rounded-xl bg-slate-50/80 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Call Summary</p>
            <p className="mt-1 text-base text-slate-700">{request.call_summary || 'No summary available.'}</p>
          </div>

          <div className="rounded-xl bg-slate-50/80 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Missing Info</p>
            <p className="mt-1 text-base text-slate-700">{request.missing_info || 'None noted.'}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50/80 p-4 text-base text-slate-700">
              <p className="font-semibold text-slate-900">Price Mentioned</p>
              <p>{request.price_mentioned ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded-xl bg-slate-50/80 p-4 text-base text-slate-700">
              <p className="font-semibold text-slate-900">Quoted Price</p>
              <p>{request.quoted_price ? `$${request.quoted_price}` : 'N/A'}</p>
            </div>
            <div className="rounded-xl bg-slate-50/80 p-4 text-base text-slate-700">
              <p className="font-semibold text-slate-900">Confidence Score</p>
              <p>{request.confidence_score || 0}</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50/80 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Transcript</p>
            <p className="mt-1 whitespace-pre-wrap text-base text-slate-700">{detail?.transcript || 'Transcript unavailable.'}</p>
          </div>

          {detail?.recording_url ? (
            <a
              href={detail.recording_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-xl bg-slate-700 px-4 py-2 text-base font-semibold text-white"
            >
              Open Recording
            </a>
          ) : null}
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-lg font-semibold text-slate-900">Michael Notes</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg text-slate-800"
            placeholder="Add note to send with status update"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <button
              key={action.status}
              type="button"
              disabled={updating}
              onClick={() => handleStatus(action.status)}
              className="rounded-xl bg-slate-800 px-4 py-3 text-lg font-bold text-white transition hover:bg-slate-900 disabled:opacity-60"
            >
              {action.label}
            </button>
          ))}
        </div>

        {message ? <p className="mt-4 rounded-xl bg-emerald-100 p-3 text-base font-semibold text-emerald-800">{message}</p> : null}
      </article>
    </section>
  )
}
