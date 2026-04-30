import { useEffect, useState } from 'react'
import RequestCard from '../components/RequestCard'
import { getRequests } from '../services/api'

export default function DashboardPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      const data = await getRequests()
      if (active) {
        setRequests(data)
        setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <p className="text-xl font-semibold text-slate-700">Loading requests...</p>
  }

  return (
    <section>
      <h2 className="mb-4 text-3xl font-bold text-ink">Incoming Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </section>
  )
}
