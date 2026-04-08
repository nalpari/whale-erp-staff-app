import { useQuery } from '@tanstack/react-query'
import { todoApi } from '@/lib/api-endpoints'
import { queryKeys } from './query-keys'

/**
 * 기간별 TODO 캘린더 조회
 * - memberId: 직원 ID
 * - from/to: YYYY-MM-DD 형식
 * - 한 달치를 한 번에 조회 후 클라이언트에서 날짜별로 필터링
 */
export const useTodoCalendar = (
  params: { memberId: number | null; year: number; month: number },
  enabled = true,
) =>
  useQuery({
    queryKey: queryKeys.todo.homeCalendar(String(params.year), String(params.month)),
    queryFn: () => todoApi.getCalendarByEmployee({
      memberId: params.memberId!,
      year: params.year,
      month: params.month,
    }),
    enabled: enabled && params.memberId !== null,
  })
