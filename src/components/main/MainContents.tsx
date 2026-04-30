'use client'
import { useRouter } from 'next/navigation'
import { usePopupController } from '@/store/usePopupController'
import { useMainCalendarData } from '@/hooks/useMainCalendarData'
import { buildTodoOrgSearchParams } from '@/lib/todo-org-route'
import WorkplaceCard from './WorkplaceCard'
import MainCalendar from './MainCalendar'

const WEEKDAYS_SHORT = ['일', '월', '화', '수', '목', '금', '토']

export default function MainContents() {
  const router = useRouter()
  const setAIChatPopup  = usePopupController((s) => s.setAIChatPopup)
  const openQrCodePopup = usePopupController((s) => s.openQrCodePopup)

  const {
    calYear, calMonth, calendarData,
    selectedDate, setSelectedDate,
    handleMonthChange, handleTodayClick,
    activeTab, setActiveTab,
    selectedDateStr, isSelectedToday,
    workplaces,
    activeGroups, todoGroups, todoOnlyOrgs,
    selectedDayTodoData,
    attendanceMap,
    isLoading, showEmpty,
    resolveGroupColor,
  } = useMainCalendarData()

  const displayMonth     = selectedDate.getMonth() + 1
  const displayDay       = selectedDate.getDate()
  const displayDayOfWeek = WEEKDAYS_SHORT[selectedDate.getDay()]

  return (
    <div className="container main">
      <div className="main-contents">

        {/* ── 캘린더 영역 ── */}
        <MainCalendar
          calYear={calYear}
          calMonth={calMonth}
          calendarData={calendarData}
          selectedDate={selectedDate}
          onDayClick={setSelectedDate}
          onMonthChange={handleMonthChange}
          onTodayClick={handleTodayClick}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* ── 선택 날짜 근무 목록 ── */}
        <div className="date-list-wrap">
          <div className="date-list-header">
            <div className="date-list-tit">
              {displayMonth}월 {displayDay}일 {displayDayOfWeek}요일
              {isSelectedToday && <span className="badge-today">오늘</span>}
            </div>
            <div className="data-jop-wrap">
              {(activeTab === 'all' || activeTab === 'commute') && (
                <div className={`data-jop work${activeTab !== 'all' ? ' no-divider' : ''}`}>
                  근무: {activeGroups.length}
                </div>
              )}
              {(activeTab === 'all' || activeTab === 'todo') && (
                <div className="data-jop todo">TO-DO: {selectedDayTodoData?.totalCount ?? 0}</div>
              )}
            </div>
          </div>

          {isLoading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>불러오는 중...</div>
          )}
          {!isLoading && showEmpty && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>예정된 근무가 없습니다.</div>
          )}

          {/* 근무처 카드 (출퇴근·TODO 포함) */}
          <ul className="date-cont-list">
            {todoGroups.map((group, idx) => (
              <WorkplaceCard
                key={idx}
                group={group}
                ringColor={resolveGroupColor(group)}
                workplaces={workplaces}
                selectedDateStr={selectedDateStr}
                isSelectedToday={isSelectedToday}
                attendance={attendanceMap.get(
                  group.storeName ?? group.franchiseName ?? group.headOfficeName,
                )}
                selectedDayTodoData={selectedDayTodoData}
                activeTab={activeTab}
                onQrOpen={(wpId, name, storeId, checkIn, checkOut) =>
                  openQrCodePopup(wpId, name, storeId, checkIn, checkOut)
                }
              />
            ))}

            {/* TODO만 있는 근무처 (전체·TODO 탭) */}
            {(activeTab === 'all' || activeTab === 'todo') && todoOnlyOrgs.map((org) => {
              const ringColor = resolveGroupColor(org)
              const orgName = org.storeName ?? org.franchiseName ?? org.headOfficeName
              const wpIncomplete = org.todos.filter((t) => !t.isCompleted).length
              const wpCompleted  = org.todos.filter((t) => t.isCompleted).length

              return (
                <li key={`todo-only-${org.headOfficeId}-${org.franchiseId}-${org.storeId}`} className="date-cont-item">
                  <div className="date-cont-header">
                    <div className="date-cont-ring" style={{ backgroundColor: ringColor }} />
                    <div className="date-cont-info">
                      <div className="date-cont-info-name">{orgName}</div>
                    </div>
                  </div>
                  <div className="date-cont-wrap">
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
                            const params = buildTodoOrgSearchParams(selectedDateStr, org)
                            router.push(`/todo?${params.toString()}`)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <button className="Ai" onClick={() => setAIChatPopup(true)} />
    </div>
  )
}
