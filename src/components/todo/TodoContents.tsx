'use client'

import { useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'
import { useTodoMonthlyCalendar, useToggleTodoStatus } from '@/hooks/queries'
import TodoCalendar from './TodoCalendar'
import type { OrgGroup, TodoItem } from '@/types/todo'
import './css/todo-temp.css'

const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

function formatDateKorean(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = WEEKDAYS[date.getDay()]
  return `${month}월 ${day}일 ${weekday}`
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getOrgGroupsForDay(
  data: ReturnType<typeof useTodoMonthlyCalendar>['data'],
  day: number,
): OrgGroup[] {
  return data?.data.find((d) => d.day === day)?.organizations ?? []
}

function getOrgDisplayName(org: OrgGroup): string {
  if (org.storeName) return org.storeName
  if (org.franchiseName) return org.franchiseName
  return org.headOfficeName
}

function parseInitialDate(dateParam: string | null): Date {
  if (!dateParam) return new Date()
  const parsed = new Date(dateParam)
  if (isNaN(parsed.getTime())) {
    console.warn(`[TodoContents] 유효하지 않은 date 파라미터: "${dateParam}", 오늘 날짜로 대체합니다.`)
    return new Date()
  }
  return parsed
}

export default function TodoContents() {
  const searchParams = useSearchParams()
  const memberId = useAuthStore((s) => s.user?.memberId)
  const selectedWorkplaceId = useWorkplaceStore((s) => s.selectedWorkplaceId)

  const [selectedDate, setSelectedDate] = useState(() =>
    parseInitialDate(searchParams.get('date')),
  )
  const [isCalendarOpen, setIsCalendarOpen] = useState(true)

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth() + 1

  const { data: calendarData, isError: isCalendarError } = useTodoMonthlyCalendar(memberId, year, month, selectedWorkplaceId)
  const { mutate: toggleStatus, isPending } = useToggleTodoStatus(memberId, year, month, selectedWorkplaceId)

  const isToday = isSameDay(selectedDate, new Date())
  const orgGroups = getOrgGroupsForDay(calendarData, selectedDate.getDate())

  const moveDay = (delta: number) => setSelectedDate((prev) => addDays(prev, delta))
  const goToToday = () => setSelectedDate(new Date())

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      moveDay(deltaX > 0 ? -1 : 1)
    }
  }

  const handleToggleTodo = (todoId: number, currentCompleted: boolean) => {
    toggleStatus({ id: todoId, isCompleted: !currentCompleted })
  }

  return (
    <div
      className="todo-contents"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="todo-content-tit">TO-DO 체크</div>

      <TodoCalendar
        selectedDate={selectedDate}
        initialCalendarData={calendarData?.data ?? []}
        onDateSelect={setSelectedDate}
        isGridOpen={isCalendarOpen}
        onToggleGrid={() => setIsCalendarOpen((prev) => !prev)}
        employeeInfoId={selectedWorkplaceId}
      />

      <div className="todo-list-wrap">
        <div className="todo-date" style={{ justifyContent: 'flex-start', gap: 4 }}>
          <button
            className="whale-calendar__nav-button"
            onClick={() => moveDay(-1)}
            aria-label="이전 날"
            style={{ '--whale-calendar-border': '#ededed', '--whale-calendar-bg': '#ffffff', '--whale-calendar-radius-full': '9999px', '--whale-calendar-nav-button-size': '32px' } as React.CSSProperties}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M18.5 12L14.5 16L18.5 20" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span>{formatDateKorean(selectedDate)}</span>
          {!isToday && (
            <button className="btn-form xs outline" onClick={goToToday}>오늘</button>
          )}
          <button
            className="whale-calendar__nav-button"
            onClick={() => moveDay(1)}
            aria-label="다음 날"
            style={{ '--whale-calendar-border': '#ededed', '--whale-calendar-bg': '#ffffff', '--whale-calendar-radius-full': '9999px', '--whale-calendar-nav-button-size': '32px' } as React.CSSProperties}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M14.5 20L18.5 16L14.5 12" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {isCalendarError ? (
          <div className="todo-empty">할 일 정보를 불러오지 못했습니다</div>
        ) : orgGroups.length === 0 ? (
          <div className="todo-empty">할 일이 없습니다</div>
        ) : (
          orgGroups.map((org) => (
            <TodoOrgSection
              key={`${org.headOfficeId}-${org.franchiseId}-${org.storeId}`}
              org={org}
              onToggle={handleToggleTodo}
              isPending={isPending}
            />
          ))
        )}
      </div>
    </div>
  )
}

function TodoOrgSection({
  org,
  onToggle,
  isPending,
}: {
  org: OrgGroup
  onToggle: (id: number, isCompleted: boolean) => void
  isPending: boolean
}) {
  return (
    <div className="todo-list-item">
      <div className="todo-list-item-tit">{getOrgDisplayName(org)}</div>
      <div className="todo-check-wrap">
        {org.todos.map((todo) => (
          <TodoCheckItem key={todo.id} todo={todo} onToggle={onToggle} isPending={isPending} />
        ))}
      </div>
    </div>
  )
}

function TodoCheckItem({
  todo,
  onToggle,
  isPending,
}: {
  todo: TodoItem
  onToggle: (id: number, isCompleted: boolean) => void
  isPending: boolean
}) {
  return (
    <div className="todo-check-item">
      <div className="check-form-box">
        <input
          type="checkbox"
          id={`todo-check-${todo.id}`}
          checked={todo.isCompleted}
          disabled={isPending}
          onChange={() => onToggle(todo.id, todo.isCompleted)}
        />
        <label htmlFor={`todo-check-${todo.id}`}>{todo.content}</label>
      </div>
    </div>
  )
}
