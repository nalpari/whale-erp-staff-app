'use client'
import { useRouter } from 'next/navigation'
import { usePopupController } from '@/store/usePopupController'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useAttendanceToday } from '@/hooks/queries/use-attendance-queries'
import { useScheduleByOrg } from '@/hooks/queries/use-schedule-queries'
import type { ScheduleGroupResponse } from '@/types/api'

/** 오늘 날짜를 YYYY-MM-DD 형식으로 반환 */
function getTodayString(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/** YYYY-MM-DD → yyyy.MM.dd (API 파라미터 형식) */
function toScheduleDateParam(dateStr: string): string {
  return dateStr.replace(/-/g, '.')
}

/** HH:mm:ss → HH:MM 또는 미기록 시 '-' */
function formatTime(timeStr?: string | null): string {
  if (!timeStr) return '-'
  return timeStr.slice(0, 5)
}

/** 스케줄 그룹에서 표시명 결정 */
function getGroupName(group: ScheduleGroupResponse): string {
  return group.storeName ?? group.franchiseName ?? group.headOfficeName
}

/** colorIndex → CSS 색상 */
const WORKPLACE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
]
function colorFromIndex(index: number): string {
  return WORKPLACE_COLORS[index % WORKPLACE_COLORS.length]
}

export default function MainContents() {
  const router = useRouter()
  const setAIChatPopup = usePopupController((state) => state.setAIChatPopup)
  const openQrCodePopup = usePopupController((state) => state.openQrCodePopup)
  const selectedWorkplaceId = useWorkplaceStore((s) => s.selectedWorkplaceId)
  const workplaces = useWorkplaceStore((s) => s.workplaces)
  const user = useAuthStore((s) => s.user)

  const today = getTodayString()
  const todayParam = toScheduleDateParam(today)

  // 오늘 출퇴근 기록
  const { data: attendanceData, isLoading: isAttendanceLoading } = useAttendanceToday()
  const attendanceWorkplaces = attendanceData?.data?.workplaces ?? []

  // 오늘 근무 스케줄 (by-org)
  const { data: scheduleData, isLoading: isScheduleLoading } = useScheduleByOrg(
    user?.memberId ?? null,
    todayParam,
    todayParam,
  )
  const scheduleGroups = scheduleData?.data ?? []

  const isLoading = isAttendanceLoading || isScheduleLoading

  const now = new Date()
  const displayMonth = now.getMonth() + 1
  const displayDay = now.getDate()
  const displayDayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()]

  // 오늘 근무 있는 그룹만 필터링 (hasWork=true, isDeleted=false)
  const todayActiveGroups = scheduleGroups.filter((group) =>
    group.schedules.some((s) => s.date === today && s.hasWork && !s.isDeleted),
  )

  // 선택된 근무처 정보 조회
  const selectedWorkplace =
    selectedWorkplaceId !== null
      ? (workplaces.find((wp) => wp.id === selectedWorkplaceId) ?? null)
      : null

  // 선택된 근무처로 필터링 (null = 전체 표시)
  const displayedGroups =
    selectedWorkplace === null
      ? todayActiveGroups
      : todayActiveGroups.filter((g) => getGroupName(g) === selectedWorkplace.storeName)

  // 출퇴근 기록 맵 (attendance.workplaceName = 실제 점포명 = workplace.storeName)
  const attendanceMap = new Map(
    attendanceWorkplaces.map((wp) => [
      wp.workplaceName,
      {
        checkInTime: wp.checkInTime,
        checkOutTime: wp.checkOutTime,
        color: colorFromIndex(wp.colorIndex),
      },
    ]),
  )

  const showEmpty = !isLoading && displayedGroups.length === 0

  return (
    <div className="container main">
      <div className="main-contents">
        <div className="dtae-calendar-wrap"></div>
        <div className="date-list-wrap">
          <div className="date-list-header">
            <div className="date-list-tit">
              {displayMonth}월 {displayDay}일 {displayDayOfWeek}요일
            </div>
            <div className="data-jop-wrap">
              <div className="data-jop work">근무: {todayActiveGroups.length}일</div>
            </div>
          </div>

          {isLoading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              불러오는 중...
            </div>
          )}
          {showEmpty && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              오늘 예정된 근무가 없습니다.
            </div>
          )}

          <ul className="date-cont-list">
            {displayedGroups.map((group, idx) => {
              const groupName = getGroupName(group)
              const todaySchedule = group.schedules.find(
                (s) => s.date === today && s.hasWork && !s.isDeleted,
              )
              // attendance.workplaceName = 실제 점포명 = workplace.storeName
              const attendance = attendanceMap.get(groupName)
              // workplaceId는 workplace.storeName으로 매칭
              const matchedWp = workplaces.find((wp) => wp.storeName === groupName)
              const ringColor = attendance?.color ?? (matchedWp ? colorFromIndex(matchedWp.colorIndex) : undefined)

              return (
                <li key={idx} className="date-cont-item">
                  <div className="date-cont-header">
                    <div
                      className="date-cont-ring"
                      style={{ backgroundColor: ringColor }}
                    ></div>
                    <div className="date-cont-info">
                      <div className="date-cont-info-name">{groupName}</div>
                      <div className="date-cont-info-time">
                        {formatTime(todaySchedule?.startTime)}-{formatTime(todaySchedule?.endTime)}
                      </div>
                    </div>
                  </div>
                  <div className="date-cont-wrap">
                    <div className="date-cont-data-item">
                      <div className="cont-item-tit work">출퇴근 체크</div>
                      <div className="cont-item-data-wrap">
                        <div className="data-item-inner">
                          {(['checkInTime', 'checkOutTime'] as const).map((key) => (
                            <div
                              key={key}
                              className="data-item-inner-item"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                const wpId = matchedWp?.id
                                if (wpId) openQrCodePopup(wpId, groupName, matchedWp?.storeId)
                              }}
                            >
                              <span>{key === 'checkInTime' ? '출근 ' : '퇴근 '}</span>
                              {formatTime(attendance?.[key])}
                            </div>
                          ))}
                        </div>
                        <div
                          className="data-item-inner-arr"
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            router.push(`/commute?store=${encodeURIComponent(groupName)}`)
                          }
                        ></div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

        </div>
      </div>
      <button className="Ai" onClick={() => setAIChatPopup(true)}></button>
    </div>
  )
}
