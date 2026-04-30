export default function MetricCard({ label, value, helper }) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.5)] backdrop-blur-md">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
      {helper ? <p className="mt-1 text-sm text-slate-600">{helper}</p> : null}
    </article>
  )
}
