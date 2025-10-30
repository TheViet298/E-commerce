import { http } from './http'

export async function createBooking(scheduleId: number, persons: number) {
  const { data } = await http.post(`/bookings/${scheduleId}?persons=${persons}`)
  return data
}
