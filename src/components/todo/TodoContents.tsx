'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TodoCalendar from './TodoCalendar'
import { fetchMonthlyCalendar, toggleTodoStatus } from '@/lib/todoApi'
import type { CalendarDayData, OrgGroup, TodoItem } from '@/types/todo'
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

/** 월별 데이터에서 특정 일자의 조직 그룹 추출 */
function getOrgGroupsForDay(
  calendarData: CalendarDayData[],
  day: number,
): OrgGroup[] {
  const dayData = calendarData.find((d) => d.day === day)
  return dayData?.organizations ?? []
}

/** 조직 그룹 표시명 생성 */
function getOrgDisplayName(org: OrgGroup): string {
  if (org.storeName) return org.storeName
  if (org.franchiseName) return org.franchiseName
  return org.headOfficeName
}

/** calendarData 내 특정 todo의 isCompleted를 토글한 새 배열 반환 */
function toggleTodoInCalendarData(
  data: CalendarDayData[],
  todoId: number,
): CalendarDayData[] {
  return data.map((dayData) => ({
    ...dayData,
    organizations: dayData.organizations.map((org) => ({
      ...org,
      todos: org.todos.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    })),
  }))
}

function parseInitialDate(dateParam: string | null): Date {
  if (!dateParam) return new Date()
  const parsed = new Date(dateParam)
  return isNaN(parsed.getTime()) ? new Date() : parsed
}

export default function TodoContents() {
  const searchParams = useSearchParams()
  const [selectedDate, setSelectedDate] = useState(() =>
    parseInitialDate(searchParams.get('date')),
  )
  const [todoData, setTodoData] = useState<CalendarDayData[]>([])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // 스와이프 추적
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  // 현재 로드된 월 추적 (TODO 목록용)
  const loadedMonthRef = useRef('')

  const isToday = isSameDay(selectedDate, new Date())
  const selectedDay = selectedDate.getDate()
  const orgGroups = getOrgGroupsForDay(todoData, selectedDay)

  // 선택된 날짜의 월 데이터 로드 (TODO 목록용)
  const loadTodoData = useCallback((year: number, month: number) => {
    const key = `${year}-${month}`
    if (loadedMonthRef.current === key) return
    loadedMonthRef.current = key
    fetchMonthlyCalendar(year, month).then(setTodoData).catch(() => {})
  }, [])

  // 선택 날짜 변경 시 해당 월 데이터 로드
  useEffect(() => {
    loadTodoData(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
  }, [selectedDate, loadTodoData])

  // 스와이프 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        setSelectedDate((prev) => addDays(prev, -1))
      } else {
        setSelectedDate((prev) => addDays(prev, 1))
      }
    }
  }

  // TODO 상태 토글 (낙관적 업데이트)
  const handleToggleTodo = async (todoId: number, currentCompleted: boolean) => {
    const prevData = todoData
    setTodoData(toggleTodoInCalendarData(todoData, todoId))

    try {
      await toggleTodoStatus(todoId, !currentCompleted)
    } catch {
      setTodoData(prevData)
    }
  }

  // 캘린더 날짜 선택
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
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
        initialCalendarData={todoData}
        onDateSelect={handleDateSelect}
        isGridOpen={isCalendarOpen}
        onToggleGrid={() => setIsCalendarOpen((prev) => !prev)}
      />

      <div className="todo-list-wrap">
        <div className="todo-date">
          <div className="todo-date-left">
            <span>{formatDateKorean(selectedDate)}</span>
            {!isToday && (
              <button
                className="btn-form xs outline"
                onClick={() => setSelectedDate(new Date())}
              >
                오늘
              </button>
            )}
          </div>
        </div>

        {orgGroups.length === 0 ? (
          <div className="todo-empty">할 일이 없습니다</div>
        ) : (
          orgGroups.map((org) => (
            <TodoOrgSection
              key={`${org.headOfficeId}-${org.franchiseId}-${org.storeId}`}
              org={org}
              onToggle={handleToggleTodo}
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
}: {
  org: OrgGroup
  onToggle: (id: number, isCompleted: boolean) => void
}) {
  return (
    <div className="todo-list-item">
      <div className="todo-list-item-tit">{getOrgDisplayName(org)}</div>
      <div className="todo-check-wrap">
        {org.todos.map((todo) => (
          <TodoCheckItem key={todo.id} todo={todo} onToggle={onToggle} />
        ))}
      </div>
    </div>
  )
}

function TodoCheckItem({
  todo,
  onToggle,
}: {
  todo: TodoItem
  onToggle: (id: number, isCompleted: boolean) => void
}) {
  return (
    <div className="todo-check-item">
      <div className="check-form-box">
        <input
          type="checkbox"
          id={`todo-check-${todo.id}`}
          checked={todo.isCompleted}
          onChange={() => onToggle(todo.id, todo.isCompleted)}
        />
        <label htmlFor={`todo-check-${todo.id}`}>{todo.content}</label>
      </div>
    </div>
  )
}
