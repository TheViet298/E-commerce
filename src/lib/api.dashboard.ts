import { http } from './http'

export type SummaryRes = {
  totalVessels: number
  totalSchedules: number
  totalBookings: number
  pending: number
  awaitingPayment: number
  confirmed: number
  refunded: number
}

export type VesselFill = {
  vesselId: number
  name: string
  capacity: number
  booked: number
  occupancy: number // server trả hoặc FE tự tính
}

export async function fetchSummary(): Promise<SummaryRes> {
  const { data } = await http.get('/dashboard/summary')
  return data
}

// map vesselName → name để tránh lỗi undefined
export async function fetchVesselFill(): Promise<VesselFill[]> {
  const { data } = await http.get('/dashboard/vessels')
  return (data ?? []).map((x: any) => ({
    vesselId: x.vesselId,
    name: x.vesselName ?? x.name,
    capacity: x.capacity ?? 0,
    booked: x.booked ?? 0,
    occupancy: x.capacity ? Math.round((x.booked / x.capacity) * 100) : 0
  }))
}
