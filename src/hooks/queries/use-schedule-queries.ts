import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { scheduleApi } from '@/lib/api-endpoints'

/**
 * 조직별 근무 스케줄 조회
 * @param memberId 회원 ID (null이면 비활성)
 * @param from 시작일 (yyyy.MM.dd)
 * @param to 종료일 (yyyy.MM.dd)
 */
export const useScheduleByOrg = (
  memberId: number | null,
  from: string,
  to: string,
  enabled = true,
) =>
  useQuery({
    queryKey: queryKeys.schedule.byOrg(memberId ?? 0, from, to),
    queryFn: () => scheduleApi.getScheduleByOrg(memberId!, from, to),
    enabled: enabled && !!memberId && !!from && !!to,
  })
