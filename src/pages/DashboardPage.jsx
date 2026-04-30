import { useEffect, useState } from 'react'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import MetricCard from '../components/MetricCard'
import RequestCard from '../components/RequestCard'
import { getMetrics, getRequests } from '../services/api'

function currency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value || 0)
}

function numberWithMaxTwoDecimals(value) {
  const numeric = Number(value || 0)
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(numeric)
}

export default function DashboardPage() {
  const [requests, setRequests] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false)

  useEffect(() => {
    let active = true

    async function loadData() {
      setLoading(true)
      const [requestsResult, metricsResult] = await Promise.all([getRequests(), getMetrics()])
      if (!active) return

      setRequests(requestsResult.requests)
      setMetrics(metricsResult.metrics)

      const warnings = []
      if (requestsResult.source === 'mock') warnings.push('Requests API unavailable, showing fallback records.')
      if (metricsResult.source === 'mock') warnings.push('Metrics API unavailable, showing fallback metrics.')
      setError(warnings.join(' '))
      setLoading(false)
    }

    loadData()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="space-y-6">
      {loading ? <LoadingState label="Loading requests and metrics..." /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}

      {!loading && metrics ? (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Metrics</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <MetricCard label="Total Calls" value={metrics.totalCalls} />
            <MetricCard label="Appointments" value={metrics.appointmentRequests} />
            <MetricCard label="Needs Callback" value={metrics.needsCallback} />
            <MetricCard label="Approved" value={metrics.approvedRequests} />
            <MetricCard label="Total Cost" value={currency(metrics.totalCost)} />
            <MetricCard label="Avg Handle" value={numberWithMaxTwoDecimals(metrics.averageHandleTime)} helper="minutes" />
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedMetrics((current) => !current)}
            className="mt-4 text-sm font-semibold text-slate-700 underline underline-offset-4"
          >
            {showAdvancedMetrics ? 'Hide Advanced Metrics' : 'Show Advanced Metrics'}
          </button>

          {showAdvancedMetrics ? (
            <div className="mt-4 rounded-2xl border border-white/70 bg-white/40 p-4 backdrop-blur-md">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <MetricCard label="Total Minutes" value={numberWithMaxTwoDecimals(metrics.totalMinutes)} />
                <MetricCard label="Pricing Questions" value={metrics.pricingQuestions} />
                <MetricCard label="Availability Questions" value={metrics.availabilityQuestions} />
                <MetricCard label="General Questions" value={metrics.generalQuestions} />
                <MetricCard label="Spam Filtered" value={metrics.spamFiltered} />
                <MetricCard label="Denied Requests" value={metrics.deniedRequests} />
                <MetricCard label="Cost Per Lead" value={currency(metrics.costPerLead)} />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {!loading ? (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Incoming Requests</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {requests.map((request) => (
              <RequestCard key={request.call_id} request={request} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
