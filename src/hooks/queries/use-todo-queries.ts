import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { todoApi } from '@/lib/api-endpoints'
import type { ApiResponse, CalendarDayData } from '@/types/todo'

export const useTodoMonthlyCalendar = (
  memberId: number | undefined,
  year: number,
  month: number,
) =>
  useQuery({
    queryKey: queryKeys.todo.calendar(memberId ?? 0, year, month),
    queryFn: () => todoApi.getMonthlyCalendar(memberId!, year, month),
    enabled: !!memberId,
  })

export const useToggleTodoStatus = (
  memberId: number | undefined,
  year: number,
  month: number,
) => {
  const queryClient = useQueryClient()
  const key = queryKeys.todo.calendar(memberId ?? 0, year, month)

  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: number; isCompleted: boolean }) =>
      todoApi.toggleStatus(id, isCompleted),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const prev = queryClient.getQueryData<ApiResponse<CalendarDayData[]>>(key)
      queryClient.setQueryData<ApiResponse<CalendarDayData[]>>(key, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((dayData) => ({
            ...dayData,
            organizations: dayData.organizations.map((org) => ({
              ...org,
              todos: org.todos.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
              ),
            })),
          })),
        }
      })
      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(key, context.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todo.all() })
    },
  })
}
