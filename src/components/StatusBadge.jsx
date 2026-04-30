const styles = {
  new: 'bg-[#fef9c3] text-[#854d0e]',
  pending: 'bg-[#fef9c3] text-[#854d0e]',
  approved: 'bg-[#dcfce7] text-[#15803d]',
  denied: 'bg-[#fee2e2] text-[#b91c1c]',
  called: 'bg-sky-100 text-sky-800',
  needs_callback: 'bg-[#fff7ed] text-[#c2410c]',
  closed: 'bg-slate-100 text-slate-600',
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
    <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${styles[key] || styles.new}`}>
      {labels[key] || status}
    </span>
  )
}
