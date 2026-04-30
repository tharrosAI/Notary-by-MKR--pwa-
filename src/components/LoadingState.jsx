export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/60 p-6 text-lg font-semibold text-slate-700 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.5)] backdrop-blur-md">
      {label}
    </div>
  )
}
