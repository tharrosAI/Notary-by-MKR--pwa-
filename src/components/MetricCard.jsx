export default function MetricCard({ label, value, helper }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-2 text-[28px] font-bold leading-none text-slate-900">{value}</p>
      {helper ? <p className="mt-1 text-[13px] text-slate-400">{helper}</p> : null}
    </article>
  )
}
