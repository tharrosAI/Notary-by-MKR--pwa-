import { Calendar, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function parseQuotedPrice(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') {
    const cleaned = value.trim()
    if (!cleaned || ['na', 'n/a'].includes(cleaned.toLowerCase())) return null
    const numeric = Number(cleaned.replace(/\$/g, '').replace(/,/g, ''))
    return Number.isFinite(numeric) ? numeric : null
  }
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function getIntentLabel(request) {
  const quote = parseQuotedPrice(request.quoted_price)
  const callType = String(request.call_type || '').toLowerCase()
  const callback = request.needs_michael_callback

  if (quote !== null) return 'Ready to Book'
  if (callback) return 'Needs Follow-Up'
  if (callType === 'appointment_request') return 'Appointment Request'
  if (callType.includes('pricing')) return 'Pricing Question'
  if (callType.includes('availability')) return 'Availability Question'
  if (callType === 'spam') return 'Spam'
  return 'Inquiry'
}

export default function RequestCard({ request }) {
  const quotedPrice = parseQuotedPrice(request.quoted_price)
  const intent = getIntentLabel(request)
  const hasDateOrTime = Boolean(request.preferred_date || request.preferred_time)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-6 py-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold leading-tight text-slate-900">{request.caller_name}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-700">{intent}</span>
            {quotedPrice !== null ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">
                {formatCurrency(quotedPrice)}
              </span>
            ) : null}
          </div>
        </div>
        <StatusBadge status={request.call_status} />
      </div>

      <div className="space-y-2">
        <p className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-500">
          Urgency: {request.urgency || 'N/A'}
        </p>

        {hasDateOrTime ? (
          <div className="flex items-center gap-2 text-[13px] text-slate-700">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{request.preferred_date || 'N/A'}</span>
            <Clock3 className="ml-2 h-4 w-4 text-slate-400" />
            <span>{request.preferred_time || 'N/A'}</span>
          </div>
        ) : null}
      </div>

      <p className="mt-4 border-t border-slate-100 pt-4 text-[13px] text-slate-700">
        {request.call_summary || 'Unavailable'}
      </p>

      <Link
        to={`/request/${request.call_id}`}
        state={{ request }}
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-[14px] font-semibold text-white transition hover:opacity-90"
      >
        Open Request
      </Link>
    </article>
  )
}
