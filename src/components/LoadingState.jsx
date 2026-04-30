export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-[14px] font-medium text-slate-700">
      {label}
    </div>
  )
}
