'use client'
import { useState, useMemo } from 'react'
import type { CalendarData } from 'whale-calendar'
import { useAuthStore } from '@/store/useAuthStore'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'
import { useAttendanceToday, useAttendanceHistory } from '@/hooks/queries/use-attendance-queries'
import { useScheduleByOrg } from '@/hooks/queries/use-schedule-queries'
import { useTodoCalendar } from '@/hooks/queries/use-todo-queries'
import type { CalendarDayData } from '@/types/todo'
import { formatDate } from '@/lib/date-utils'
import { getGroupName } from '@/lib/schedule-utils'
import { isSameTodoOrgIdentity } from '@/lib/todo-org-route'

// ─── 색상 상수 ──────────────────────────────────────────────
export const WORKPLACE_COLORS = [
  '#FF3B3B', '#FF8C00', '#FFD700',
  '#34C759', '#007AFF', '#3A3FBF', '#9B59B6',
]
export function colorFromIndex(index: number): string {
  return WORKPLACE_COLORS[index % WORKPLACE_COLORS.length]
}

export type TabType = 'all' | 'commute' | 'todo'

export interface AttendanceEntry {
  checkInTime: string | null
  checkOutTime: string | null
}

/** 홈 화면 캘린더·출퇴근·할 일 데이터를 관리하는 커스텀 훅 */
export function useMainCalendarData() {
  const user = useAuthStore((s) => s.user)
  const workplaces = useWorkplaceStore((s) => s.workplaces)
  const selectedWorkplaceId = useWorkplaceStore((s) => s.selectedWorkplaceId)

  // 오늘 날짜 (마운트 시 1회 고정)
  const [todayStr] = useState<string>(() => formatDate(new Date()))

  // 캘린더 뷰 상태
  const [calYear, setCalYear] = useState<number>(() => new Date().getFullYear())
  const [calMonth, setCalMonth] = useState<number>(() => new Date().getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const selectedDateStr = formatDate(selectedDate)
  const isSelectedToday = selectedDateStr === todayStr
  const mm = String(calMonth).padStart(2, '0')

  // ─── API 조회 ─────────────────────────────────────────────
  const lastDay = String(new Date(calYear, calMonth, 0).getDate()).padStart(2, '0')
  const monthFromParam = `${calYear}.${mm}.01`
  const monthToParam   = `${calYear}.${mm}.${lastDay}`

  const { data: monthScheduleData } = useScheduleByOrg(
    user?.memberId ?? null, monthFromParam, monthToParam,
  )
  const monthScheduleGroups = useMemo(
    () => monthScheduleData?.data ?? [],
    [monthScheduleData],
  )

  const { data: todoCalendarData } = useTodoCalendar(
    { year: calYear, month: calMonth },
  )
  const todoCalendarDays = useMemo(
    () => todoCalendarData?.data ?? [],
    [todoCalendarData],
  )

  const { data: attendanceData, isLoading: isAttendanceLoading } = useAttendanceToday(isSelectedToday)
  const { data: historyData, isLoading: isHistoryLoading } = useAttendanceHistory(
    { from: selectedDateStr, to: selectedDateStr },
    !isSelectedToday,
  )
  const isLoading = isAttendanceLoading || isHistoryLoading

  // ─── 색상 맵 ─────────────────────────────────────────────
  const workplaceColorByName = useMemo(() => {
    const map = new Map<string, string>()
    workplaces.forEach((wp, idx) => {
      const name = wp.storeName ?? wp.workplaceName
      if (name) map.set(name, colorFromIndex(idx))
    })
    return map
  }, [workplaces])

  const workplaceColorByStoreId = useMemo(() => {
    const map = new Map<number, string>()
    workplaces.forEach((wp, idx) => {
      if (wp.storeId != null) map.set(wp.storeId, colorFromIndex(idx))
    })
    return map
  }, [workplaces])

  // ─── 캘린더 마커 데이터 ───────────────────────────────────
  const calendarData: CalendarData = useMemo(() => {
    const result: CalendarData = {}
    const showCommute = activeTab === 'all' || activeTab === 'commute'
    const showTodo    = activeTab === 'all' || activeTab === 'todo'

    if (showCommute) {
      for (const group of monthScheduleGroups) {
        const groupName = getGroupName(group)
        const color = workplaceColorByName.get(groupName) ?? colorFromIndex(0)
        for (const schedule of group.schedules) {
          if (!schedule.hasWork || schedule.isDeleted) continue
          if (!result[schedule.date]) result[schedule.date] = { schedules: [] }
          result[schedule.date].schedules?.push({ id: `${schedule.date}-${groupName}`, label: '●', color })
        }
      }
    }

    if (showTodo) {
      for (const todoDay of todoCalendarDays) {
        const d = String(todoDay.day).padStart(2, '0')
        const dateStr = `${calYear}-${mm}-${d}`
        for (const org of todoDay.organizations) {
          if (activeTab === 'all') {
            const alreadyHas = result[dateStr]?.schedules?.some((s) => s.id === `${dateStr}-${org.storeName}`)
            if (alreadyHas) continue
          }
          const color = workplaceColorByStoreId.get(org.storeId) ?? colorFromIndex(0)
          if (!result[dateStr]) result[dateStr] = { schedules: [] }
          result[dateStr].schedules?.push({ id: `todo-${dateStr}-${org.headOfficeId}-${org.franchiseId}-${org.storeId}`, label: '●', color })
        }
      }
    }

    for (const dateStr of Object.keys(result)) {
      result[dateStr].schedules?.sort((a, b) => {
        const ai = WORKPLACE_COLORS.indexOf(a.color ?? '')
        const bi = WORKPLACE_COLORS.indexOf(b.color ?? '')
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
      })
    }
    return result
  }, [activeTab, monthScheduleGroups, workplaceColorByName, todoCalendarDays, workplaceColorByStoreId, calYear, mm])

  // ─── 출퇴근 맵 ───────────────────────────────────────────
  const attendanceMap = useMemo(() => {
    const map = new Map<string, AttendanceEntry>()
    if (isSelectedToday) {
      for (const wp of (attendanceData?.data?.workplaces ?? [])) {
        map.set(wp.workplaceName, { checkInTime: wp.checkInTime, checkOutTime: wp.checkOutTime })
      }
    } else {
      for (const item of (historyData?.data?.items ?? [])) {
        map.set(item.workplaceName, { checkInTime: item.checkInTime, checkOutTime: item.checkOutTime })
      }
    }
    return map
  }, [isSelectedToday, attendanceData, historyData])

  // ─── 선택 날짜 파생 ──────────────────────────────────────
  const activeGroups = monthScheduleGroups.filter((group) =>
    group.schedules.some((s) => s.date === selectedDateStr && s.hasWork && !s.isDeleted),
  )

  const selectedDayTodoData = useMemo(
    () => todoCalendarDays.find((d) => d.day === selectedDate.getDate()) ?? null,
    [todoCalendarDays, selectedDate],
  )

  const selectedWorkplace = selectedWorkplaceId !== null
    ? (workplaces.find((wp) => wp.id === selectedWorkplaceId) ?? null)
    : null

  const selectedWorkplaceTodoOrgIdentity = useMemo(() => {
    if (selectedWorkplace === null) return null

    const selectedWorkplaceName = selectedWorkplace.storeName ?? selectedWorkplace.workplaceName
    return selectedDayTodoData?.organizations.find((org) => {
      if (selectedWorkplace.storeId != null && org.storeId != null) {
        return org.storeId === selectedWorkplace.storeId
      }

      const orgName = org.storeName ?? org.franchiseName ?? org.headOfficeName
      return orgName === selectedWorkplaceName
    }) ?? null
  }, [selectedDayTodoData, selectedWorkplace])

  const displayedGroups = selectedWorkplace === null
    ? activeGroups
    : activeGroups.filter((g) => getGroupName(g) === selectedWorkplace.storeName)

  const todoGroups = useMemo(() => {
    if (activeTab !== 'todo') return displayedGroups
    return displayedGroups.filter((group) => {
      const matchedWp = workplaces.find((wp) => wp.storeName === getGroupName(group))
      if (!matchedWp?.storeId) return false
      return selectedDayTodoData?.organizations.some((org) => org.storeId === matchedWp.storeId) ?? false
    })
  }, [activeTab, displayedGroups, workplaces, selectedDayTodoData])

  const todoOnlyOrgs = useMemo(() => {
    const scheduleStoreIds = new Set(todoGroups.map((g) => g.storeId).filter(Boolean))
    const scheduleNames = new Set(todoGroups.map((g) => getGroupName(g)))
    const orgs = selectedDayTodoData?.organizations ?? []
    const filtered = orgs.filter((org) => {
      if (org.storeId != null && scheduleStoreIds.has(org.storeId)) return false
      const orgName = org.storeName ?? org.franchiseName ?? org.headOfficeName
      if (scheduleNames.has(orgName)) return false
      return true
    })
    if (selectedWorkplace === null) return filtered
    if (selectedWorkplaceTodoOrgIdentity === null) return []

    return filtered.filter((org) => isSameTodoOrgIdentity(org, selectedWorkplaceTodoOrgIdentity))
  }, [todoGroups, selectedDayTodoData, selectedWorkplace, selectedWorkplaceTodoOrgIdentity])

  const hasTodoContent = todoGroups.length > 0 || todoOnlyOrgs.length > 0
  const showEmpty = !isLoading && (
    (activeTab === 'commute' && displayedGroups.length === 0) ||
    (activeTab === 'all' && displayedGroups.length === 0 && todoOnlyOrgs.length === 0) ||
    (activeTab === 'todo' && !hasTodoContent)
  )

  // ─── 핸들러 ──────────────────────────────────────────────
  const handleMonthChange = (year: number, month: number) => {
    setCalYear(year)
    setCalMonth(month)
  }

  const handleTodayClick = () => {
    const now = new Date()
    setCalYear(now.getFullYear())
    setCalMonth(now.getMonth() + 1)
    setSelectedDate(now)
  }

  return {
    // 캘린더
    calYear, calMonth, calendarData,
    selectedDate, setSelectedDate,
    handleMonthChange, handleTodayClick,
    activeTab, setActiveTab,
    // 날짜 표시
    selectedDateStr, isSelectedToday, todayStr,
    // 데이터
    workplaces,
    activeGroups, todoGroups, todoOnlyOrgs,
    selectedDayTodoData,
    attendanceMap,
    isLoading, showEmpty,
  }
}

// 타입 re-export
export { getGroupName }
export type { CalendarDayData }
