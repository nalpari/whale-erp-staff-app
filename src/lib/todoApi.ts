import { apiFetch } from './api'
import type { ApiResponse, CalendarDayData } from '@/types/todo'

const MEMBER_ID = 11 // 임시 하드코딩 (로그인 미구현)

/** API #9 - 회원별 월별 캘린더 조회 */
export async function fetchMonthlyCalendar(
  year: number,
  month: number,
): Promise<CalendarDayData[]> {
  const res = await apiFetch<ApiResponse<CalendarDayData[]>>(
    `/api/v1/employee-todos/mobile/calendar/by-employee?memberId=${MEMBER_ID}&year=${year}&month=${month}`,
  )
  return res.data
}

/** API #5 - TODO 상태 변경 */
export async function toggleTodoStatus(
  id: number,
  isCompleted: boolean,
): Promise<void> {
  await apiFetch(`/api/v1/employee-todos/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isCompleted }),
  })
}
