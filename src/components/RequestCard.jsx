import { Calendar, Clock3, FileText, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
      <p className="text-base text-slate-700">
        <span className="font-semibold text-slate-800">{label}:</span> {value || 'N/A'}
      </p>
    </div>
  )
}

export default function RequestCard({ request }) {
  return (
    <article className="group rounded-[20px] border border-white/70 bg-white/60 p-6 shadow-[0_28px_60px_-28px_rgba(15,23,42,0.55)] backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-100 hover:shadow-[0_30px_65px_-26px_rgba(22,78,99,0.45)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold leading-tight text-slate-900">{request.caller_name}</h2>
          <p className="mt-1 text-base text-slate-700">{request.service_type || 'Notary Service Request'}</p>
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
        <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
          Urgency: {request.urgency || 'normal'}
        </p>
        <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
          Callback: {request.needs_michael_callback ? 'Yes' : 'No'}
        </p>
      </div>

      <p className="mt-4 line-clamp-3 text-base text-slate-700">{request.call_summary || 'No summary available.'}</p>

      <Link
        to={`/request/${request.call_id}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-800 px-4 py-3 text-xl font-bold text-white transition hover:bg-slate-900"
      >
        Open Request
      </Link>
    </article>
  )
}
