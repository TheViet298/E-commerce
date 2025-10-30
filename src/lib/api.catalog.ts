import { http } from './http'

export type CatalogItem = {
  scheduleId: number
  vesselId: number
  vesselName: string
  vesselCapacity: number
  departDate: string
  nights: number
}

export async function fetchCatalog(): Promise<CatalogItem[]> {
  const { data } = await http.get('/public/catalog')
  return data
}
