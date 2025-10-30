import { http } from './http'

// Khớp với VesselRes (id, name, capacity)
export type VesselRow = { id: number; name: string; capacity: number | null }

// gọi API Admin BE
export async function fetchVessels(): Promise<VesselRow[]> {
  const { data } = await http.get('/admin/vessels')
  return data
}

// PUT /api/admin/vessels/{id}/capacity
export async function updateCapacity(id: number, capacity: number) {
  await http.put(`/admin/vessels/${id}/capacity`, { capacity })
}

// POST /api/admin/vessels/{id}/schedules
export async function createSchedule(
  vesselId: number,
  payload: { departDate: string; nights: number; price?: number }
) {
  const { data } = await http.post(`/admin/vessels/${vesselId}/schedules`, payload)
  return data as number // scheduleId
}
