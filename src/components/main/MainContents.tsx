'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { WhaleCalendar } from 'whale-calendar'
import type { CalendarData } from 'whale-calendar'
import 'whale-calendar/styles.css'
import { usePopupController } from '@/store/usePopupController'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useAttendanceToday, useAttendanceHistory } from '@/hooks/queries/use-attendance-queries'
import { useScheduleByOrg } from '@/hooks/queries/use-schedule-queries'
import { useTodoCalendar } from '@/hooks/queries/use-todo-queries'
import type { ScheduleGroupResponse } from '@/types/api'

/** Date → 'YYYY-MM-DD' */
function formatDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}


/** HH:mm:ss → HH:mm, null → '-' */
function formatTime(timeStr?: string | null): string {
  if (!timeStr) return '-'
  if (timeStr.includes('T')) return timeStr.slice(11, 16)
  return timeStr.slice(0, 5)
}

/** 스케줄 그룹에서 표시명 결정 */
function getGroupName(group: ScheduleGroupResponse): string {
  return group.storeName ?? group.franchiseName ?? group.headOfficeName
}

/** 빨-주-노-초-파-남-보 순서 근무처 색상 */
const WORKPLACE_COLORS = [
  '#FF3B3B', // 빨 (빨강)
  '#FF8C00', // 주 (주황)
  '#FFD700', // 노 (노랑)
  '#34C759', // 초 (초록)
  '#007AFF', // 파 (파랑)
  '#3A3FBF', // 남 (남색)
  '#9B59B6', // 보 (보라)
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

  // 오늘 날짜를 마운트 시 한 번만 계산 (useState lazy init으로 렌더 중 ref 접근 방지)
  const [todayStr] = useState<string>(() => formatDateStr(new Date()))

  // 캘린더 상태 — 기본값: 오늘
  const [calYear, setCalYear] = useState<number>(() => new Date().getFullYear())
  const [calMonth, setCalMonth] = useState<number>(() => new Date().getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())

  // 탭 상태 (전체 / 출퇴근 / TODO)
  type TabType = 'all' | 'commute' | 'todo'
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const selectedDateStr = formatDateStr(selectedDate)
  const isSelectedToday = selectedDateStr === todayStr

  // 현재 표시 월의 from/to
  const mm = String(calMonth).padStart(2, '0')
  const lastDay = String(new Date(calYear, calMonth, 0).getDate()).padStart(2, '0')
  // by-org API 파라미터 형식: yyyy.MM.dd
  const monthFromParam = `${calYear}.${mm}.01`
  const monthToParam = `${calYear}.${mm}.${lastDay}`

  // 해당 월 전체 근무 일정 조회 (by-org)
  const { data: monthScheduleData } = useScheduleByOrg(
    user?.memberId ?? null,
    monthFromParam,
    monthToParam,
  )
  const monthScheduleGroups = useMemo(
    () => monthScheduleData?.data ?? [],
    [monthScheduleData],
  )

  // 해당 월 전체 TODO 조회 (by-employee calendar)
  const { data: todoCalendarData } = useTodoCalendar(
    { memberId: user?.memberId ?? null, year: calYear, month: calMonth },
  )
  const todoCalendarDays = useMemo(
    () => todoCalendarData?.data ?? [],
    [todoCalendarData],
  )

  // 근무처명 → 빨주노초파남보 색상 맵 (workplaces 순서 기준)
  const workplaceColorByName = useMemo(() => {
    const map = new Map<string, string>()
    workplaces.forEach((wp, idx) => {
      const name = wp.storeName ?? wp.workplaceName
      if (name) map.set(name, colorFromIndex(idx))
    })
    return map
  }, [workplaces])

  // by-org 일정 → WhaleCalendar CalendarData 변환
  // 근무 일정이 있는 날짜에 해당 근무처 색상 도트 표시
  const calendarData: CalendarData = useMemo(() => {
    const result: CalendarData = {}
    for (const group of monthScheduleGroups) {
      const groupName = getGroupName(group)
      const color = workplaceColorByName.get(groupName) ?? colorFromIndex(0)
      for (const schedule of group.schedules) {
        if (!schedule.hasWork || schedule.isDeleted) continue
        if (!result[schedule.date]) result[schedule.date] = { schedules: [] }
        result[schedule.date].schedules?.push({
          id: `${schedule.date}-${groupName}`,
          label: '●',
          color,
        })
      }
    }
    return result
  }, [monthScheduleGroups, workplaceColorByName])

  // 오늘 출퇴근 기록
  const { data: attendanceData, isLoading: isAttendanceLoading } = useAttendanceToday(isSelectedToday)

  // 오늘이 아닌 날짜의 출퇴근 이력
  const { data: historyData, isLoading: isHistoryLoading } = useAttendanceHistory(
    { from: selectedDateStr, to: selectedDateStr },
    !isSelectedToday,
  )

  // 선택된 날짜의 출퇴근 맵 구성 (오늘: today API, 다른날: history API)
  const attendanceMap = useMemo(() => {
    const map = new Map<string, { checkInTime: string | null; checkOutTime: string | null }>()
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

  const isLoading = isAttendanceLoading || isHistoryLoading

  const displayMonth = selectedDate.getMonth() + 1
  const displayDay = selectedDate.getDate()
  const displayDayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()]

  // 선택된 날짜에 근무 있는 그룹 — 이미 가져온 월 데이터에서 클라이언트 필터링
  const activeGroups = monthScheduleGroups.filter((group) =>
    group.schedules.some((s) => s.date === selectedDateStr && s.hasWork && !s.isDeleted),
  )

  // 선택된 날짜의 TODO day 데이터 — day(일) 기준으로 필터링
  const selectedDayTodoData = useMemo(
    () => todoCalendarDays.find((d) => d.day === selectedDate.getDate()) ?? null,
    [todoCalendarDays, selectedDate],
  )

  // 선택된 근무처로 필터링
  const selectedWorkplace = selectedWorkplaceId !== null
    ? (workplaces.find((wp) => wp.id === selectedWorkplaceId) ?? null)
    : null
  const displayedGroups = selectedWorkplace === null
    ? activeGroups
    : activeGroups.filter((g) => getGroupName(g) === selectedWorkplace.storeName)

  const showEmpty = !isLoading && displayedGroups.length === 0 && activeTab !== 'todo'
  const showTodoEmpty = activeTab === 'todo' && (selectedDayTodoData?.totalCount ?? 0) === 0

  // 월 변경: 캘린더 뷰만 이동, 선택된 날짜는 유지
  const handleMonthChange = (year: number, month: number) => {
    setCalYear(year)
    setCalMonth(month)
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
  }

  // 오늘 버튼
  const handleTodayClick = () => {
    const now = new Date()
    setCalYear(now.getFullYear())
    setCalMonth(now.getMonth() + 1)
    setSelectedDate(now)
  }

  return (
    <div className="container main">
      <div className="main-contents">
        {/* 캘린더 영역 */}
        <div className="dtae-calendar-wrap">
          <div className="calendar-nav-overlay">
            <button className="calendar-today-btn" onClick={handleTodayClick}>오늘</button>
          </div>
          <div className="calendar-tab-overlay">
            {([['all', '전체'], ['commute', '출퇴근'], ['todo', 'TO-DO']] as [TabType, string][]).map(([key, label]) => (
              <button
                key={key}
                className={`calendar-tab-btn${activeTab === key ? ' active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <WhaleCalendar
            year={calYear}
            month={calMonth}
            data={calendarData}
            selectedDate={selectedDate}
            onMonthChange={handleMonthChange}
            onDayClick={handleDayClick}
            onScheduleClick={(date) => handleDayClick(date)}
            showToday={true}
            locale="ko"
          />
        </div>

        {/* 선택된 날짜의 근무 정보 */}
        <div className="date-list-wrap">
          <div className="date-list-header">
            <div className="date-list-tit">
              {displayMonth}월 {displayDay}일 {displayDayOfWeek}요일
              {isSelectedToday && <span className="badge-today">오늘</span>}
            </div>
            <div className="data-jop-wrap">
              <div className="data-jop work">근무: {activeGroups.length}</div>
              <div className="data-jop todo">TO-DO: {selectedDayTodoData?.totalCount ?? 0}</div>
            </div>
          </div>

          {isLoading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              불러오는 중...
            </div>
          )}
          {!isLoading && showEmpty && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              예정된 근무가 없습니다.
            </div>
          )}
          {!isLoading && showTodoEmpty && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              이 날의 TO-DO가 없습니다.
            </div>
          )}

          {/* 근무·출퇴근 리스트 (전체/출퇴근 탭) */}
          {activeTab !== 'todo' && (
            <ul className="date-cont-list">
              {displayedGroups.map((group, idx) => {
                const groupName = getGroupName(group)
                const daySchedule = group.schedules.find(
                  (s) => s.date === selectedDateStr && s.hasWork && !s.isDeleted,
                )
                const attendance = attendanceMap.get(groupName)
                const matchedWp = workplaces.find((wp) => wp.storeName === groupName)
                const wpIdx = matchedWp ? workplaces.indexOf(matchedWp) : idx
                const ringColor = colorFromIndex(wpIdx)

                // storeId로 매칭된 오늘의 TODO organization
                const wpTodoOrg = activeTab === 'all' && matchedWp?.storeId
                  ? (selectedDayTodoData?.organizations.find(
                      (org) => org.storeId === matchedWp.storeId,
                    ) ?? null)
                  : null
                const wpTodos = wpTodoOrg?.todos ?? []
                const wpIncomplete = wpTodos.filter((t) => !t.isCompleted).length
                const wpCompleted = wpTodos.filter((t) => t.isCompleted).length

                return (
                  <li key={idx} className="date-cont-item">
                    <div className="date-cont-header">
                      <div className="date-cont-ring" style={{ backgroundColor: ringColor }} />
                      <div className="date-cont-info">
                        <div className="date-cont-info-name">{groupName}</div>
                        <div className="date-cont-info-time">
                          {formatTime(daySchedule?.startTime)}-{formatTime(daySchedule?.endTime)}
                        </div>
                      </div>
                    </div>
                    <div className="date-cont-wrap">
                      {/* 출퇴근 체크 row */}
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
                                  if (matchedWp?.id) openQrCodePopup(matchedWp.id, groupName, matchedWp.storeId)
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
                            onClick={() => router.push(`/commute?store=${encodeURIComponent(groupName)}`)}
                          />
                        </div>
                      </div>

                      {/* TO-DO 체크 row (전체 탭에서만, 출퇴근 체크와 동일한 구조) */}
                      {activeTab === 'all' && (
                        <div className="date-cont-data-item">
                          <div className="cont-item-tit todo">TO-DO 체크</div>
                          <div className="cont-item-data-wrap">
                            <div className="data-item-inner">
                              <div className="data-item-inner-item">
                                <span>미완료 </span>
                                <span style={{ color: wpIncomplete > 0 ? '#2379e4' : undefined }}>
                                  {wpIncomplete}
                                </span>
                              </div>
                              <div className="data-item-inner-item">
                                <span>완료 </span>
                                <span style={{ color: wpCompleted > 0 ? '#36886a' : undefined }}>
                                  {wpCompleted}
                                </span>
                              </div>
                            </div>
                            <div
                              className="data-item-inner-arr"
                              style={{ cursor: 'pointer' }}
                              onClick={() => setActiveTab('todo')}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {/* TO-DO 리스트 (todo 탭) — organization별 그룹 표시 */}
          {activeTab === 'todo' && (selectedDayTodoData?.organizations ?? []).length > 0 && (
            <div style={{ padding: '0 24px' }}>
              {(selectedDayTodoData?.organizations ?? []).map((org) => (
                <div key={org.storeId} className="todo-list-item" style={{ padding: '22px 0 0' }}>
                  <div className="todo-list-item-tit">{org.storeName}</div>
                  <div className="todo-check-wrap">
                    {org.todos.map((todo) => (
                      <div key={todo.id} className="todo-check-item">
                        <div className="check-form-box">
                          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <span style={{
                              flexShrink: 0,
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              border: `2px solid ${todo.isCompleted ? '#36886a' : '#ccc'}`,
                              backgroundColor: todo.isCompleted ? '#36886a' : '#fff',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '1px',
                            }}>
                              {todo.isCompleted && (
                                <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                                  <path d="M1 3.5L4 6.5L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </span>
                            <span style={{
                              flex: 1,
                              fontSize: '15px',
                              fontWeight: 500,
                              color: '#1a1a1a',
                              textDecoration: todo.isCompleted ? 'line-through' : 'none',
                              opacity: todo.isCompleted ? 0.5 : 1,
                            }}>
                              {todo.content}
                              <span style={{ display: 'block', fontSize: '12px', color: '#aaa', marginTop: '3px', fontWeight: 400, textDecoration: 'none' }}>
                                {todo.todoDate}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button className="Ai" onClick={() => setAIChatPopup(true)} />
    </div>
  )
}
