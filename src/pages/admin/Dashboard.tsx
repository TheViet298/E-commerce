import { useEffect, useState } from 'react'
import { fetchSummary, fetchVesselFill, SummaryRes, VesselFill } from '../../lib/api.dashboard'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, LabelList
} from 'recharts'

export default function AdminDashboard() {
  const [sum, setSum] = useState<SummaryRes | null>(null)
  const [fill, setFill] = useState<VesselFill[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const [s, f] = await Promise.all([fetchSummary(), fetchVesselFill()])
        setSum(s)
        setFill(f.sort((a, b) => b.occupancy - a.occupancy))
      } catch (e: any) {
        setErr(e?.response?.data?.message || e?.message || 'Load dashboard failed')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>
  if (err) return <div style={{ padding: 24, color: '#dc2626' }}>{err}</div>

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Admin Dashboard</h1>

      {/* Summary cards */}
      {sum && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: 16, marginBottom: 24
        }}>
          <Card title="Vessels" value={sum.totalVessels} />
          <Card title="Schedules" value={sum.totalSchedules} />
          <Card title="Bookings" value={sum.totalBookings} />
        </div>
      )}

      {/* Booking status */}
      <Section title="Booking status">
        <div className="card" style={{ padding: 8 }}>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'PENDING', value: sum?.pending ?? 0 },
                  { name: 'AWAIT', value: sum?.awaitingPayment ?? 0 },
                  { name: 'CONFIRMED', value: sum?.confirmed ?? 0 },
                  { name: 'REFUNDED', value: sum?.refunded ?? 0 },
                ]}
                margin={{ top: 10, right: 16, left: 0, bottom: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(v: number) => [v, 'Bookings']} />
                <Legend />
                <Bar dataKey="value" name="Bookings" fill="#0ea5e9">
                  <LabelList position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* Capacity vs Booked */}
      <Section title="Vessel capacity vs booked">
        <div className="card" style={{ padding: 8 }}>
          <div style={{ height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fill} margin={{ top: 10, right: 16, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(v: number, key) => [v, key === 'capacity' ? 'Capacity' : 'Booked']}
                  labelFormatter={(label) => `Vessel: ${label}`}
                />
                <Legend />
                <Bar dataKey="booked" name="Booked" fill="#0ea5e9">
                  <LabelList dataKey="occupancy" formatter={(v: number) => `${v}%`} position="top" />
                </Bar>
                <Bar dataKey="capacity" name="Capacity" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '6px 0 10px' }}>{title}</h2>
      {children}
    </section>
  )
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  )
}
