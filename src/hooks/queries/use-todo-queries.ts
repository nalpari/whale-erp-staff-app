
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { todoApi } from '@/lib/api-endpoints'
import { useAuthStore } from '@/store/useAuthStore'
import type { ApiResponse } from '@/types/api'
import type { CalendarDayData } from '@/types/todo'

export const useTodoCalendar = (
  params: { year: number; month: number },
  enabled = true,
) => {
  const memberId = useAuthStore((s) => s.user?.memberId ?? null)

  return useQuery({
    queryKey: queryKeys.todo.homeCalendar(memberId, String(params.year), String(params.month)),
    queryFn: () => todoApi.getCalendarByEmployee({
      year: params.year,
      month: params.month,
    }),
    enabled: enabled && memberId !== null,
  })
}

export const useTodoMonthlyCalendar = (
  year: number,
  month: number,
  employeeInfoId?: number | null,
  enabled = true,
) => {
  const memberId = useAuthStore((s) => s.user?.memberId ?? null)

  return useQuery({
    queryKey: queryKeys.todo.calendar(memberId, year, month, employeeInfoId),
    queryFn: () => todoApi.getMonthlyCalendar(year, month, employeeInfoId),
    enabled: enabled && memberId !== null,
  })
}

export const useToggleTodoStatus = (
  year: number,
  month: number,
  employeeInfoId?: number | null,
) => {
  const memberId = useAuthStore((s) => s.user?.memberId ?? null)
  const queryClient = useQueryClient()
  const key = queryKeys.todo.calendar(memberId, year, month, employeeInfoId)

  return useMutation({
    mutationFn: async ({ id, isCompleted }: { id: number; isCompleted: boolean }) => {
      if (memberId === null) {
        throw new Error('인증 정보가 없어 TODO 상태를 변경할 수 없습니다.')
      }
      return todoApi.toggleStatus(id, isCompleted)
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const prev = queryClient.getQueryData<ApiResponse<CalendarDayData[]>>(key)
      // setQueryData 실패 시에도 prev를 반환해 롤백 보장
      try {
        queryClient.setQueryData<ApiResponse<CalendarDayData[]>>(key, (old) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.map((dayData) => {
              const updatedOrgs = dayData.organizations.map((org) => ({
                ...org,
                todos: org.todos.map((todo) =>
                  todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
                ),
              }))
              const allTodos = updatedOrgs.flatMap((o) => o.todos)
              return {
                ...dayData,
                organizations: updatedOrgs,
                totalCount: allTodos.length,
                completedCount: allTodos.filter((t) => t.isCompleted).length,
                incompleteCount: allTodos.filter((t) => !t.isCompleted).length,
              }
            }),
          }
        })
      } catch (e) {
        console.error('[TodoToggle] 낙관적 업데이트 적용 실패:', e)
      }
      return { prev }
    },
    onError: (err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(key, context.prev)
      console.error('[TodoToggle] 상태 변경 실패:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todo.all() })
    },
  })
}
