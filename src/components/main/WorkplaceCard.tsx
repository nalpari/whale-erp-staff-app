'use client'
import { useRouter } from 'next/navigation'
import type { ScheduleGroupResponse, WorkplaceResponse } from '@/types/api'
import type { CalendarDayData } from '@/types/todo'
import { formatTime } from '@/lib/date-utils'
import { colorFromIndex, type AttendanceEntry, type TabType } from '@/hooks/useMainCalendarData'
import { getGroupName } from '@/lib/schedule-utils'

interface Props {
  group: ScheduleGroupResponse
  index: number
  workplaces: WorkplaceResponse[]
  selectedDateStr: string
  isSelectedToday: boolean
  attendance: AttendanceEntry | undefined
  selectedDayTodoData: CalendarDayData | null
  activeTab: TabType
  onQrOpen: (workplaceId: number, name: string, storeId: number | null | undefined, checkIn: string | null, checkOut: string | null) => void
}

/** 홈 화면 날짜별 근무처 카드 */
export default function WorkplaceCard({
  group,
  index,
  workplaces,
  selectedDateStr,
  isSelectedToday,
  attendance,
  selectedDayTodoData,
  activeTab,
  onQrOpen,
}: Props) {
  const router = useRouter()
  const groupName = getGroupName(group)

  const daySchedule = group.schedules.find(
    (s) => s.date === selectedDateStr && s.hasWork && !s.isDeleted,
  )
  const matchedWp = workplaces.find((wp) =>
    group.storeId != null ? wp.storeId === group.storeId : wp.storeName === groupName,
  )
  const wpIdx = matchedWp ? workplaces.indexOf(matchedWp) : index
  const ringColor = colorFromIndex(wpIdx)

  const wpTodoOrg = selectedDayTodoData?.organizations.find((org) => {
    if (matchedWp?.storeId != null && org.storeId != null) return org.storeId === matchedWp.storeId
    const orgName = org.storeName ?? org.franchiseName ?? org.headOfficeName
    return orgName === groupName
  }) ?? null
  const wpTodos = wpTodoOrg?.todos ?? []
  const wpIncomplete = wpTodos.filter((t) => !t.isCompleted).length
  const wpCompleted  = wpTodos.filter((t) => t.isCompleted).length

  // 출퇴근 row: TODO 탭이 아닐 때만
  const showCommuteRow = activeTab !== 'todo'
  // TO-DO row: 출퇴근 탭 아닐 때 + (전체 탭이면 todo가 있을 때만, TODO 탭이면 항상)
  const showTodoRow = activeTab !== 'commute' && (activeTab === 'todo' || wpTodos.length > 0)

  return (
    <li className="date-cont-item">
      <div className="date-cont-header">
        <div className="date-cont-ring" style={{ backgroundColor: ringColor }} />
        <div className="date-cont-info">
          <div className="date-cont-info-name">{groupName}</div>
          {showCommuteRow && (
            <div className="date-cont-info-time">
              {formatTime(daySchedule?.startTime)}-{formatTime(daySchedule?.endTime)}
            </div>
          )}
        </div>
      </div>

      <div className="date-cont-wrap">
        {/* 출퇴근 체크 row */}
        {showCommuteRow && (
          <div className="date-cont-data-item">
            <div className="cont-item-tit work">출퇴근 체크</div>
            <div className="cont-item-data-wrap">
              <div className="data-item-inner">
                {(['checkInTime', 'checkOutTime'] as const).map((key) => (
                  <div
                    key={key}
                    className="data-item-inner-item"
                    style={{ cursor: isSelectedToday ? 'pointer' : 'default' }}
                    onClick={() => {
                      if (!isSelectedToday || !matchedWp?.id) return
                      onQrOpen(
                        matchedWp.id,
                        groupName,
                        matchedWp.storeId,
                        attendance?.checkInTime ?? null,
                        attendance?.checkOutTime ?? null,
                      )
                    }}
                  >
                    <span>{key === 'checkInTime' ? '출근 ' : '퇴근 '}</span>
                    {formatTime(attendance?.[key])}
                  </div>
                ))}
              </div>
              {isSelectedToday ? (
                <div
                  className="data-item-inner-arr"
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/commute${group.storeId != null ? `?storeId=${group.storeId}` : ''}`)}
                />
              ) : (
                <div className="data-item-inner-arr" style={{ opacity: 0.3 }} />
              )}
            </div>
          </div>
        )}

        {/* TO-DO 체크 row */}
        {showTodoRow && (
          <div className="date-cont-data-item">
            <div className="cont-item-tit todo">TO-DO 체크</div>
            <div className="cont-item-data-wrap">
              <div className="data-item-inner">
                <div className="data-item-inner-item">
                  <span>미완료 </span>
                  <span style={{ color: wpIncomplete > 0 ? '#2379e4' : undefined }}>{wpIncomplete}</span>
                </div>
                <div className="data-item-inner-item">
                  <span>완료 </span>
                  <span style={{ color: wpCompleted > 0 ? '#36886a' : undefined }}>{wpCompleted}</span>
                </div>
              </div>
              <div
                className="data-item-inner-arr"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const params = new URLSearchParams({ date: selectedDateStr })
                  if (matchedWp?.id) params.set('employeeInfoId', String(matchedWp.id))
                  router.push(`/todo?${params.toString()}`)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </li>
  )
}
