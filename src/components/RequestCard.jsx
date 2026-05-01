import { Calendar, Clock3, FileText, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <p className="text-[13px] text-slate-700">
        <span className="font-semibold text-slate-900">{label}:</span> {value || 'N/A'}
      </p>
    </div>
  )
}

export default function RequestCard({ request }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-6 py-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold leading-tight text-slate-900">{request.caller_name}</h2>
          <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            {request.service_type || 'Notary Service Request'}
          </p>
        </div>
        <StatusBadge status={request.call_status} />
      </div>

      <div className="space-y-3">
        <Field icon={Phone} label="Phone" value={request.caller_phone} />
        <Field icon={FileText} label="Document" value={request.document_type} />
        <Field icon={MapPin} label="Location" value={request.location_address} />
        <Field icon={Calendar} label="Date" value={request.preferred_date} />
        <Field icon={Clock3} label="Time" value={request.preferred_time} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <p className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-500">
          Urgency: {request.urgency || 'normal'}
        </p>
        <p className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-500">
          Callback: {request.needs_michael_callback ? 'Yes' : 'No'}
        </p>
      </div>

      <p className="mt-4 border-t border-slate-100 pt-4 text-[13px] text-slate-700">
        {request.call_summary || 'No summary available.'}
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
