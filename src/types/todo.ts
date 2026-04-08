/** API #9 - 모바일 직원용 월별 캘린더 일 단위 응답 */
export interface CalendarDayData {
  day: number
  totalCount: number
  completedCount: number
  incompleteCount: number
  organizations: OrgGroup[]
}

/** 조직별 TODO 그룹 */
export interface OrgGroup {
  headOfficeId: number
  headOfficeName: string
  franchiseId: number | null
  franchiseName: string | null
  storeId: number | null
  storeName: string | null
  todos: TodoItem[]
}

/** 개별 TODO 아이템 */
export interface TodoItem {
  id: number
  content: string
  todoDate: string
  isCompleted: boolean
}
