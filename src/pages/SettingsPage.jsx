import { useState } from 'react'
import { getDefaultAvailability, saveAvailability } from '../services/api'

export default function SettingsPage() {
  const [availability, setAvailability] = useState(getDefaultAvailability())
  const [message, setMessage] = useState('')

  function updateDay(day, value) {
    setAvailability((prev) => ({ ...prev, [day]: value }))
  }

  async function handleSave(event) {
    event.preventDefault()
    const result = await saveAvailability(availability)
    setMessage(`Availability saved (${result.source}).`)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <h2 className="text-3xl font-bold text-ink">Availability Settings</h2>
      <p className="mt-1 text-lg text-slate-700">Set your hours for new booking requests.</p>

      <form className="mt-4 space-y-3" onSubmit={handleSave}>
        {Object.entries(availability).map(([day, value]) => (
          <label key={day} className="block">
            <span className="mb-1 block text-lg font-semibold capitalize text-slate-800">{day}</span>
            <input
              value={value}
              onChange={(event) => updateDay(day, event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg"
            />
          </label>
        ))}

        <button type="submit" className="mt-2 w-full rounded-xl bg-brand-600 px-4 py-3 text-2xl font-bold text-white">
          Save Availability
        </button>
      </form>

      {message && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-base font-semibold text-emerald-800">{message}</p>}

      <p className="mt-6 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
        API webhook placeholders are in <code>src/services/api.js</code> under the <code>endpoints</code> object.
      </p>
    </section>
  )
}
