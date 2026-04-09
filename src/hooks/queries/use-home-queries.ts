import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { homeApi } from '@/lib/api-endpoints'

export const useCalendar = (yearMonth: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.home.calendar(yearMonth),
    queryFn: () => homeApi.getCalendar(yearMonth),
    enabled: enabled && !!yearMonth,
  })

export const useDailySummary = (date: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.home.dailySummary(date),
    queryFn: () => homeApi.getDailySummary(date),
    enabled: enabled && !!date,
  })
