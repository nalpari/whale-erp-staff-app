import type { ScheduleGroupResponse } from '@/types/api'

/**
 * ScheduleGroupResponse에서 표시용 이름을 반환.
 * storeName → franchiseName → headOfficeName 우선순위.
 */
export function getGroupName(group: ScheduleGroupResponse): string {
  return group.storeName ?? group.franchiseName ?? group.headOfficeName
}
