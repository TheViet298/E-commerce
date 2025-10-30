import { http } from '../../lib/http'
import { useEffect, useState } from 'react'

type Row = { id:number; scheduleId:number; status:string }

export default function MyBookings(){
  const [rows,setRows]=useState<Row[]>([])
  const [err,setErr]=useState<string>()

  async function load(){
    const { data } = await http.get<Row[]>('/bookings/me')
    setRows(data)
  }
  useEffect(()=>{ load() },[])

  async function cancel(id:number){
    try{
      await http.put(`/bookings/${id}/cancel-self`)
      await load()
    }catch(e:any){
      setErr(e?.response?.data ?? 'Hủy thất bại')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
      {err && <div className="text-red-600">{err}</div>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th>Schedule</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.id}</td>
              <td>{r.scheduleId}</td>
              <td>{r.status}</td>
              <td>
                {(r.status==='PENDING' || r.status==='AWAITING_PAYMENT') && (
                  <button onClick={()=>cancel(r.id)} className="px-3 py-1 border rounded">
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
          {rows.length===0 && (
            <tr><td colSpan={4} className="py-4 opacity-70">Chưa có booking nào.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
