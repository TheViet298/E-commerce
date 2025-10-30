import { useEffect, useState } from 'react'
import { fetchCatalog, CatalogItem } from '../../lib/api.catalog'
import { createBooking } from '../../lib/api.bookings'
import { isAuthed } from '../../lib/auth'
import { useNavigate } from 'react-router-dom'

export default function Catalog(){
  const [items, setItems] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string>()
  const [bookingFor, setBookingFor] = useState<number>() // scheduleId
  const [qty, setQty] = useState(1)
  const nav = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCatalog()
        setItems(data)
      } catch {
        setErr('Không tải được catalog')
      } finally { setLoading(false) }
    })()
  }, [])

  async function bookNow(){
    if(!bookingFor) return
    if(!isAuthed()){
      nav('/login', { state: { from: '/', require: 'USER' } })
      return
    }
    try{
      await createBooking(bookingFor, qty)
      nav('/me/bookings')
    }catch(e:any){
      setErr(e?.response?.data ?? 'Đặt chỗ thất bại')
    } finally{
      setBookingFor(undefined); setQty(1)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (err) return <div className="p-6 text-red-600">{err}</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Catalog</h1>
      <ul className="grid gap-4">
        {items.map(it => (
          <li key={it.scheduleId} className="rounded-2xl border p-4">
            <div className="text-xl font-semibold">{it.vesselName}</div>
            <div className="text-sm opacity-70">
              Schedule #{it.scheduleId} • Capacity: {it.vesselCapacity}
            </div>
            <div className="mt-2">
              Khởi hành: {new Date(it.departDate).toLocaleDateString()} • {it.nights} đêm
            </div>
            <div className="mt-4">
              <button className="px-3 py-2 rounded-xl border"
                onClick={() => setBookingFor(it.scheduleId)}>
                Book now
              </button>
            </div>
          </li>
        ))}
      </ul>

      {bookingFor && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-4 w-[360px]">
            <h3 className="text-lg font-semibold mb-2">Đặt chỗ</h3>
            <label className="text-sm">Số lượng</label>
            <input type="number" min={1} value={qty}
              onChange={e=>setQty(parseInt(e.target.value||'1'))}
              className="w-full border rounded-lg px-2 py-2 mb-2"/>
            <div className="mt-3 flex gap-2 justify-end">
              <button className="px-3 py-2" onClick={()=>setBookingFor(undefined)}>Hủy</button>
              <button className="px-3 py-2 rounded-xl border" onClick={bookNow}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
