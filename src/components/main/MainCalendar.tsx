'use client'
import { WhaleCalendar } from 'whale-calendar'
import 'whale-calendar/styles.css'
import type { CalendarData } from 'whale-calendar'
import type { TabType } from '@/hooks/useMainCalendarData'

interface Props {
  calYear: number
  calMonth: number
  calendarData: CalendarData
  selectedDate: Date
  onDayClick: (date: Date) => void
  onMonthChange: (year: number, month: number) => void
  onTodayClick: () => void
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const TAB_LABELS: [TabType, string][] = [
  ['all', '전체'],
  ['commute', '출퇴근'],
  ['todo', 'TO-DO'],
]

/** 홈 화면 캘린더 영역 (헤더 탭 + WhaleCalendar) */
export default function MainCalendar({
  calYear, calMonth, calendarData,
  selectedDate, onDayClick,
  onMonthChange, onTodayClick,
  activeTab, onTabChange,
}: Props) {
  return (
    <div className="date-calendar-wrap">
      <div className="calendar-header-row">
        <button className="calendar-today-btn" onClick={onTodayClick}>오늘</button>
        <div className="calendar-tab-group">
          {TAB_LABELS.map(([key, label]) => (
            <button
              key={key}
              className={`calendar-tab-btn${activeTab === key ? ' active' : ''}`}
              onClick={() => onTabChange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <WhaleCalendar
        year={calYear}
        month={calMonth}
        data={calendarData}
        selectedDate={selectedDate}
        onMonthChange={onMonthChange}
        onDayClick={onDayClick}
        onScheduleClick={onDayClick}
        showToday={true}
        locale="ko"
      />
    </div>
  )
}
