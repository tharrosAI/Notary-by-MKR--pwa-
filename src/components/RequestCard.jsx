import { Link } from 'react-router-dom'

export default function RequestCard({ request }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-ink">{request.clientName}</h2>
          <p className="text-base text-slate-700">{request.serviceType}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{request.status}</span>
      </div>

      <dl className="space-y-1 text-lg text-slate-800">
        <div>
          <dt className="inline font-semibold">Date:</dt> <dd className="inline">{request.date}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">Time:</dt> <dd className="inline">{request.time}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">Location:</dt> <dd className="inline">{request.location}</dd>
        </div>
      </dl>

      <Link
        to={`/request/${request.id}`}
        className="mt-4 inline-block w-full rounded-xl bg-brand-600 px-4 py-3 text-center text-xl font-bold text-white"
      >
        Open Request
      </Link>
    </article>
  )
}
