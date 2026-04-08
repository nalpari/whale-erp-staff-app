import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { todoApi } from '@/lib/api-endpoints'
import type { ApiResponse } from '@/types/api'
import type { CalendarDayData } from '@/types/todo'

export const useTodoMonthlyCalendar = (
  memberId: number | undefined,
  year: number,
  month: number,
  employeeInfoId?: number | null,
) =>
  useQuery({
    queryKey: queryKeys.todo.calendar(memberId ?? 0, year, month, employeeInfoId),
    queryFn: () => todoApi.getMonthlyCalendar(memberId!, year, month, employeeInfoId),
    enabled: !!memberId,
  })

export const useToggleTodoStatus = (
  memberId: number | undefined,
  year: number,
  month: number,
  employeeInfoId?: number | null,
) => {
  const queryClient = useQueryClient()
  const key = queryKeys.todo.calendar(memberId ?? 0, year, month, employeeInfoId)

  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: number; isCompleted: boolean }) =>
      todoApi.toggleStatus(id, isCompleted),
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
