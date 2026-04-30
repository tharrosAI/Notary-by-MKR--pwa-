export default function ErrorState({ message }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] font-medium text-amber-900">
      {message}
    </div>
  )
}
