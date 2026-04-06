import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { attendanceApi } from '@/lib/api-endpoints'
import type { AttendanceCheckRequest } from '@/types/api'

export const useAttendanceToday = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.attendance.today(),
    queryFn: () => attendanceApi.getToday(),
    enabled,
  })

export const useAttendanceHistory = (
  params?: { yearMonth?: string; workplaceId?: number },
  enabled = true,
) =>
  useQuery({
    queryKey: queryKeys.attendance.history(params),
    queryFn: () => attendanceApi.getHistory(params),
    enabled,
  })

export const useCheckIn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AttendanceCheckRequest) => attendanceApi.checkIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.today() })
    },
  })
}

export const useCheckOut = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AttendanceCheckRequest) => attendanceApi.checkOut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.today() })
    },
  })
}
