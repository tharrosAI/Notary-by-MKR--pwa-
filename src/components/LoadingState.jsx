export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-[14px] font-medium text-slate-700">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      {label}
    </div>
  )
}
