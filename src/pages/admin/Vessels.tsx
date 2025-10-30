import { useEffect, useState } from 'react'
import { fetchVessels, updateCapacity, createSchedule, VesselRow } from '../../lib/api.vessels'

export default function VesselsPage() {
  const [rows, setRows] = useState<VesselRow[]>([])
  const [cap, setCap] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({})

  // modal tạo schedule
  const [openFor, setOpenFor] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [nights, setNights] = useState(2)
  const [price, setPrice] = useState<string>('')

  async function load() {
    setLoading(true)
    try {
      const data = await fetchVessels()
      setRows(data)
      setCap(Object.fromEntries(data.map(v => [v.id, Number(v.capacity ?? 0)])))
    } catch (e: any) {
      setMsg({ err: e?.response?.data ?? 'Load failed' })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  async function saveOne(id: number) {
    setMsg({})
    try {
      await updateCapacity(id, cap[id] ?? 0)
      setMsg({ ok: 'Saved' })
    } catch (e: any) {
      setMsg({ err: e?.response?.data ?? 'Save failed' })
    }
  }

  async function saveAll() {
    setMsg({})
    for (const r of rows) {
      try { await updateCapacity(r.id, cap[r.id] ?? 0) } catch {}
    }
    await load()
    setMsg({ ok: 'Saved all' })
  }

  async function addSchedule() {
    if (!openFor) return
    if (!date) { setMsg({ err: 'Chọn ngày khởi hành' }); return }
    try {
      await createSchedule(openFor, {
        departDate: date,
        nights,
        ...(price.trim() !== '' ? { price: Number(price) } : {})
      })
      setOpenFor(null)
      setDate(''); setNights(2); setPrice('')
      setMsg({ ok: 'Schedule created' })
    } catch (e: any) {
      setMsg({ err: e?.response?.data ?? 'Create schedule failed' })
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Vessels</h1>

      {msg.err && <div style={{ marginBottom: 12, color: '#dc2626' }}>{msg.err}</div>}
      {msg.ok && <div style={{ marginBottom: 12, color: '#16a34a' }}>{msg.ok}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="card" style={{ padding: 12 }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Name</th>
                  <th style={{ width: 180 }}>Capacity</th>
                  <th style={{ width: 120 }}></th>
                  <th style={{ width: 140 }}></th>
                </tr>
              </thead>
              <tbody>
              {rows.map(v => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>
                    <input
                      type="number"
                      value={cap[v.id] ?? 0}
                      onChange={e => setCap({ ...cap, [v.id]: parseInt(e.target.value || '0', 10) })}
                      className="input"
                      style={{ width: 120 }}
                    />
                  </td>
                  <td>
                    <button className="btn" onClick={() => saveOne(v.id)}>Save</button>
                  </td>
                  <td>
                    <button className="btn" onClick={() => setOpenFor(v.id)}>Add schedule</button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={saveAll}>Save all</button>
          </div>
        </>
      )}

      {/* Modal tạo schedule */}
      {openFor && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="card" style={{ width: 380, padding: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>New schedule</h3>

            <label style={{ fontSize: 12 }}>Depart date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input"
              style={{ width: '100%', marginBottom: 8 }}
            />

            <label style={{ fontSize: 12 }}>Nights</label>
            <input
              type="number"
              min={1}
              value={nights}
              onChange={e => setNights(parseInt(e.target.value || '1', 10))}
              className="input"
              style={{ width: '100%', marginBottom: 8 }}
            />

            <label style={{ fontSize: 12 }}>Price (optional)</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="input"
              style={{ width: '100%', marginBottom: 8 }}
            />

            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'end', gap: 8 }}>
              <button className="btn" onClick={() => setOpenFor(null)}>Hủy</button>
              <button className="btn" onClick={addSchedule}>Tạo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
