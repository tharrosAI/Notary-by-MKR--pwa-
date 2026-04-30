export default function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-base font-semibold text-amber-900">
      {message}
    </div>
  )
}
