import type { ScheduleGroupResponse } from '@/types/api'

/**
 * ScheduleGroupResponse에서 표시용 이름을 반환.
 * storeName → franchiseName → headOfficeName 우선순위.
 */
export function getGroupName(group: ScheduleGroupResponse): string {
  return group.storeName ?? group.franchiseName ?? group.headOfficeName
}

/**
 * 스케줄/TODO 조직 식별자로부터 색상 맵 키를 생성.
 * storeId → franchiseId → headOfficeId 우선순위로 고유 키 반환.
 */
export function getGroupKey(group: {
  headOfficeId: number
  franchiseId: number | null
  storeId: number | null
}): string {
  if (group.storeId != null) return `store-${group.storeId}`
  if (group.franchiseId != null) return `franchise-${group.franchiseId}`
  return `head-${group.headOfficeId}`
}
