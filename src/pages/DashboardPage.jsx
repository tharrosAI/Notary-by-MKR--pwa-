import { useEffect, useMemo, useState } from 'react'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import MetricCard from '../components/MetricCard'
import RequestCard from '../components/RequestCard'
import { getMetrics, getRequests, submitIssueReport } from '../services/api'

function currency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value || 0)
}

function numberWithMaxTwoDecimals(value) {
  const numeric = Number(value || 0)
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(numeric)
}

function parseQuotedPrice(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') {
    const cleaned = value.trim()
    if (!cleaned || ['na', 'n/a'].includes(cleaned.toLowerCase())) return null
    const numeric = Number(cleaned.replace(/\$/g, '').replace(/,/g, ''))
    return Number.isFinite(numeric) ? numeric : null
  }
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function toBooleanYes(value) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return ['true', 'yes', '1'].includes(value.toLowerCase())
  return Boolean(value)
}

export default function DashboardPage() {
  const [requests, setRequests] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requestError, setRequestError] = useState('')
  const [metricsError, setMetricsError] = useState('')
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false)
  const [sortOrder, setSortOrder] = useState('newest')
  const [statusFilter, setStatusFilter] = useState('all')
  const [issueForm, setIssueForm] = useState({
    issue_type: 'AI issue',
    description: '',
    call_reference: '',
  })
  const [issueLoading, setIssueLoading] = useState(false)
  const [issueSuccess, setIssueSuccess] = useState('')
  const [issueError, setIssueError] = useState('')

  useEffect(() => {
    let active = true

    async function loadData() {
      setLoading(true)
      const [requestsResult, metricsResult] = await Promise.all([getRequests(), getMetrics()])
      if (!active) return

      setRequests(requestsResult.requests)
      setMetrics(metricsResult.metrics)
      setRequestError(requestsResult.error || '')
      setMetricsError(metricsResult.error || '')
      setLoading(false)
    }

    loadData()
    return () => {
      active = false
    }
  }, [])

  const filteredAndSortedRequests = useMemo(() => {
    const filtered = requests.filter((request) => {
      if (statusFilter === 'all') return true
      return (request.call_status || '').toLowerCase() === statusFilter
    })

    return filtered.sort((a, b) => {
      if (sortOrder === 'highest_quote' || sortOrder === 'lowest_quote') {
        const quoteA = parseQuotedPrice(a.quoted_price)
        const quoteB = parseQuotedPrice(b.quoted_price)
        const valA = quoteA === null ? -Infinity : quoteA
        const valB = quoteB === null ? -Infinity : quoteB
        return sortOrder === 'highest_quote' ? valB - valA : valA - valB
      }

      const timeA = new Date(a.timestamp || 0).getTime()
      const timeB = new Date(b.timestamp || 0).getTime()
      if (sortOrder === 'oldest') return timeA - timeB
      return timeB - timeA
    })
  }, [requests, sortOrder, statusFilter])

  const estimatedRevenue = useMemo(
    () => requests.reduce((sum, request) => sum + (parseQuotedPrice(request.quoted_price) ?? 0), 0),
    [requests],
  )

  const bookingOpportunities = useMemo(
    () =>
      requests.filter((request) => {
        const callType = String(request.call_type || '').toLowerCase()
        const status = String(request.call_status || '').toLowerCase()
        const callback = request.needs_michael_callback ?? request.needs_micheal_callback
        return callType === 'appointment_request' || status === 'approved' || toBooleanYes(callback)
      }).length,
    [requests],
  )

  const metricValue = metrics || {}

  function updateIssueField(event) {
    const { name, value } = event.target
    setIssueForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleIssueSubmit(event) {
    event.preventDefault()
    setIssueSuccess('')
    setIssueError('')

    if (!issueForm.issue_type.trim()) {
      setIssueError('Issue type is required.')
      return
    }

    if (!issueForm.description.trim()) {
      setIssueError('Description is required.')
      return
    }

    setIssueLoading(true)
    try {
      await submitIssueReport({
        issue_type: issueForm.issue_type.trim(),
        description: issueForm.description.trim(),
        call_reference: issueForm.call_reference.trim(),
        submitted_by: 'Michael',
        source: 'PWA',
      })
      setIssueSuccess('Issue reported successfully.')
      setIssueForm({ issue_type: 'AI issue', description: '', call_reference: '' })
    } catch (error) {
      setIssueError(error.message || 'Unable to report issue.')
    } finally {
      setIssueLoading(false)
    }
  }

  return (
    <section className="space-y-8">
      {loading ? <LoadingState label="Loading requests and metrics..." /> : null}
      {!loading && requestError ? <ErrorState message="No requests available." /> : null}
      {!loading && metricsError ? <ErrorState message="Metrics unavailable." /> : null}

      {!loading ? (
        <div>
          <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-400">Metrics</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <MetricCard label="Estimated Revenue (Quoted)" value={currency(estimatedRevenue)} />
            <MetricCard label="Booking Opportunities" value={bookingOpportunities} />
            <MetricCard label="Total Calls" value={metricValue.totalCalls ?? '—'} />
            <MetricCard label="Cost Per Lead" value={metrics ? currency(metricValue.costPerLead) : '—'} />
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedMetrics((current) => !current)}
            className="mt-4 rounded-full border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-900 transition hover:bg-slate-50"
          >
            {showAdvancedMetrics ? 'Hide Advanced Metrics' : 'Show Advanced Metrics'}
          </button>

          {showAdvancedMetrics ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 ease-out">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <MetricCard label="Appointments" value={metricValue.appointmentRequests ?? '—'} />
                <MetricCard label="Needs Callback" value={metricValue.needsCallback ?? '—'} />
                <MetricCard label="Approved" value={metricValue.approvedRequests ?? '—'} />
                <MetricCard label="Total Cost" value={metrics ? currency(metricValue.totalCost) : '—'} />
                <MetricCard
                  label="Avg Handle"
                  value={metrics ? numberWithMaxTwoDecimals(metricValue.averageHandleTime) : '—'}
                  helper="minutes"
                />
                <MetricCard label="Total Minutes" value={metrics ? numberWithMaxTwoDecimals(metricValue.totalMinutes) : '—'} />
                <MetricCard label="Spam Filtered" value={metricValue.spamFiltered ?? '—'} />
                <MetricCard label="Denied Requests" value={metricValue.deniedRequests ?? '—'} />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {!loading ? (
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 text-[13px] text-slate-700">
              <span className="font-medium text-slate-900">Sort</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="highest_quote">Highest quoted value</option>
                <option value="lowest_quote">Lowest quoted value</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-[13px] text-slate-700">
              <span className="font-medium text-slate-900">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900"
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
                <option value="needs_callback">Needs Callback</option>
                <option value="called">Called</option>
                <option value="closed">Closed</option>
              </select>
            </label>
          </div>

          <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-400">Incoming Requests</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredAndSortedRequests.map((request) => (
              <RequestCard key={request.call_id} request={request} />
            ))}
          </div>
          {!filteredAndSortedRequests.length ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-[14px] text-slate-700">No requests available.</div>
          ) : null}
        </div>
      ) : null}

      {!loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-400">Report Issue</h2>
          <p className="mt-2 text-[14px] text-slate-700">Flag issues for follow-up.</p>

          <form onSubmit={handleIssueSubmit} className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-slate-900">Issue Type</span>
              <select
                name="issue_type"
                value={issueForm.issue_type}
                onChange={updateIssueField}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] text-slate-900"
              >
                <option>AI issue</option>
                <option>Dashboard issue</option>
                <option>Other</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-slate-900">Description</span>
              <textarea
                rows={4}
                name="description"
                value={issueForm.description}
                onChange={updateIssueField}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] text-slate-900"
                placeholder="Describe the issue"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-slate-900">Call Reference (Optional)</span>
              <input
                name="call_reference"
                value={issueForm.call_reference}
                onChange={updateIssueField}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] text-slate-900"
                placeholder="Call ID or related reference"
              />
            </label>

            <button
              type="submit"
              disabled={issueLoading}
              className="rounded-lg bg-slate-900 px-4 py-2 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {issueLoading ? 'Submitting...' : 'Submit Issue'}
            </button>
          </form>

          {issueSuccess ? <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-emerald-800">{issueSuccess}</p> : null}
          {issueError ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-800">{issueError}</p> : null}
        </section>
      ) : null}
    </section>
  )
}
