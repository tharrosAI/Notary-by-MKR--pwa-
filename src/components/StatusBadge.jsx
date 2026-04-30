const styles = {
  new: 'bg-amber-100 text-amber-800',
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  denied: 'bg-rose-100 text-rose-800',
  called: 'bg-sky-100 text-sky-800',
  needs_callback: 'bg-violet-100 text-violet-800',
  closed: 'bg-slate-200 text-slate-700',
}

const labels = {
  new: 'New',
  pending: 'Pending',
  approved: 'Approved',
  denied: 'Denied',
  called: 'Called',
  needs_callback: 'Needs Callback',
  closed: 'Closed',
}

export default function StatusBadge({ status }) {
  const key = (status || 'new').toLowerCase()
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${styles[key] || styles.new}`}>
      {labels[key] || status}
    </span>
  )
}
